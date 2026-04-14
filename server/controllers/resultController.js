import Result from "../models/Result.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🔥 GRADE CALCULATOR
const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

// 🔥 ADD RESULT (Teacher)
export const addResult = asyncHandler(async (req, res) => {
  const { studentId, courseId, marksObtained, totalMarks, examType } = req.body;

  // 1️⃣ Validate required fields
  if (!studentId || !courseId || marksObtained == null || totalMarks == null) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // 2️⃣ Validate course
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  // 3️⃣ Validate student
  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    return res.status(400).json({
      success: false,
      message: "Invalid student",
    });
  }

  // 4️⃣ Check enrollment (SAFE FIX)
  const isEnrolled = course.students.some(
    (id) => id.toString() === studentId
  );

  if (!isEnrolled) {
    return res.status(400).json({
      success: false,
      message: "Student not enrolled in course",
    });
  }

  // 5️⃣ Prevent divide by zero
  if (totalMarks <= 0) {
    return res.status(400).json({
      success: false,
      message: "totalMarks must be greater than 0",
    });
  }

  // 6️⃣ Calculate percentage + grade
  const percentage = (marksObtained / totalMarks) * 100;
  const grade = calculateGrade(percentage);

  // 7️⃣ Check duplicate result
  const existing = await Result.findOne({
    student: studentId,
    course: courseId,
    examType,
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Result already exists for this exam type",
    });
  }

  // 8️⃣ Save result
  const result = await Result.create({
    student: studentId,
    course: courseId,
    marksObtained,
    totalMarks,
    examType,
    percentage,
    grade,
    markedBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Result added successfully",
    data: result,
  });
});

// 🔥 GET STUDENT RESULTS
export const getStudentResults = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const results = await Result.find({ student: studentId })
    .populate("course", "name code")
    .sort({ createdAt: -1 });

  // FIX: proper empty check
  if (!results.length) {
    return res.status(404).json({
      success: false,
      message: "No results found",
    });
  }

  const total = results.length;

  const avg =
    results.reduce((acc, r) => acc + r.percentage, 0) / total;

  res.json({
    success: true,
    stats: {
      totalExams: total,
      averagePercentage: Number(avg.toFixed(2)),
    },
    data: results,
  });
});

// 🔥 GET COURSE RESULTS
export const getCourseResults = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const results = await Result.find({ course: courseId })
    .populate("student", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});