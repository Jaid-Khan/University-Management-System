import Attendance from "../models/Attendance.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🔥 Mark Attendance (Teacher only)
export const markAttendance = asyncHandler(async (req, res) => {
  const { courseId, studentId, status } = req.body;

  if (!courseId || !studentId || !status) {
    return res.status(400).json({
      success: false,
      message: "courseId, studentId and status are required",
    });
  }

  // 1️⃣ Validate course
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  // 2️⃣ Validate student exists in system
  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    return res.status(400).json({
      success: false,
      message: "Invalid student",
    });
  }

  // 3️⃣ Check enrollment
  const isEnrolled = course.students.some(
    (id) => id.toString() === studentId
  );

  if (!isEnrolled) {
    return res.status(400).json({
      success: false,
      message: "Student is not enrolled in this course",
    });
  }

  // 4️⃣ Normalize date
  const today = new Date().toISOString().split("T")[0];

  // 5️⃣ Prevent duplicate
  const alreadyMarked = await Attendance.findOne({
    course: courseId,
    student: studentId,
    date: today,
  });

  if (alreadyMarked) {
    return res.status(400).json({
      success: false,
      message: "Attendance already marked for today",
    });
  }

  // 6️⃣ Create attendance
  const attendance = await Attendance.create({
    course: courseId,
    student: studentId,
    status,
    date: today,
    markedBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Attendance marked successfully",
    data: attendance,
  });
});

// 🔥 Get Student Attendance
export const getStudentAttendance = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({
      success: false,
      message: "studentId is required",
    });
  }

  const records = await Attendance.find({ student: studentId })
    .populate("course", "name code")
    .sort({ createdAt: -1 });

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;

  res.json({
    success: true,
    stats: {
      total,
      present,
      absent: total - present,
      percentage: total ? ((present / total) * 100).toFixed(2) : "0",
    },
    data: records,
  });
});

// 🔥 Bulk Attendance (Teacher only)
export const markBulkAttendance = asyncHandler(async (req, res) => {
  const { courseId, date, students } = req.body;

  if (!courseId || !students || !Array.isArray(students)) {
    return res.status(400).json({
      success: false,
      message: "courseId and students array are required",
    });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  const formattedDate = date || new Date().toISOString().split("T")[0];

  // 1️⃣ Filter only enrolled students
  const validStudents = students.filter((s) =>
    course.students.some(
      (id) => id.toString() === s.studentId
    )
  );

  if (validStudents.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid enrolled students found",
    });
  }

  // 2️⃣ Build bulk data
  const bulkData = validStudents.map((s) => ({
    course: courseId,
    student: s.studentId,
    status: s.status,
    date: formattedDate,
    markedBy: req.user.id,
  }));

  try {
    const result = await Attendance.insertMany(bulkData, {
      ordered: false,
    });

    res.status(201).json({
      success: true,
      message: "Bulk attendance marked successfully",
      count: result.length,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Some records failed (possibly duplicates)",
    });
  }
});

// 🔥 Get Attendance Percentage (Course + Student)
export const getAttendancePercentage = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.params;

  if (!studentId || !courseId) {
    return res.status(400).json({
      success: false,
      message: "studentId and courseId are required",
    });
  }

  const records = await Attendance.find({
    student: studentId,
    course: courseId,
  });

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;

  const percentage = total === 0 ? 0 : (present / total) * 100;

  res.json({
    success: true,
    total,
    present,
    absent: total - present,
    percentage: percentage.toFixed(2),
  });
});