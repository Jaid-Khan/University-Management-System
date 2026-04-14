import Course from "../models/Course.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ CREATE COURSE
export const createCourse = asyncHandler(async (req, res) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({
      success: false,
      message: "Name and code required",
    });
  }

  const course = await Course.create({ name, code });

  res.status(201).json({
    success: true,
    message: "Course created",
    data: course,
  });
});

// ✅ GET COURSES
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate("teacher", "name email role")
    .populate("students", "name email role");

  res.status(200).json({
    success: true,
    data: courses,
  });
});

// ✅ ASSIGN TEACHER
export const assignTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { teacherId } = req.body;

  const course = await Course.findById(id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  const teacher = await User.findById(teacherId);
  if (!teacher || teacher.role !== "teacher") {
    return res.status(400).json({
      success: false,
      message: "Invalid teacher",
    });
  }

  course.teacher = teacherId;
  await course.save();

  res.json({
    success: true,
    message: "Teacher assigned",
    data: course,
  });
});

// ✅ GET COURSE STUDENTS (IMPROVED)
export const getCourseStudents = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    "students",
    "name email role"
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  res.json({
    success: true,
    count: course.students.length,
    students: course.students,
  });
});

// ✅ ENROLL STUDENT (PRODUCTION READY FIXED)
export const enrollStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const courseId = req.params.id;

  // 1️⃣ Validate input
  if (!studentId) {
    return res.status(400).json({
      success: false,
      message: "studentId is required",
    });
  }

  // 2️⃣ Check course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  // 3️⃣ Check student exists + role
  const student = await User.findById(studentId);
  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  if (student.role !== "student") {
    return res.status(400).json({
      success: false,
      message: "Only students can be enrolled",
    });
  }

  // 4️⃣ Prevent duplicate enrollment
  const alreadyEnrolled = course.students.includes(studentId);

  if (alreadyEnrolled) {
    return res.status(400).json({
      success: false,
      message: "Student already enrolled in this course",
    });
  }

  // 5️⃣ Add student
  course.students.push(studentId);
  await course.save();

  // 6️⃣ Return updated course (clean + frontend ready)
  const updatedCourse = await Course.findById(courseId)
    .populate("teacher", "name email role")
    .populate("students", "name email role");

  res.status(200).json({
    success: true,
    message: "Student enrolled successfully",
    data: updatedCourse,
  });
});