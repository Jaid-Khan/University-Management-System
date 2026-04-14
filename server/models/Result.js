import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    percentage: {
      type: Number,
    },

    grade: {
      type: String,
      enum: ["A+", "A", "B", "C", "D", "F"],
    },

    examType: {
      type: String,
      enum: ["quiz", "midterm", "final", "assignment"],
      default: "midterm",
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Prevent duplicate result for same student + course + exam
resultSchema.index({ student: 1, course: 1, examType: 1 }, { unique: true });

export default mongoose.model("Result", resultSchema);