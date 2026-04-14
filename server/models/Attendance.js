import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },

    // ✅ FIX: safe date format (no time issue)
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate attendance per day
attendanceSchema.index(
  { course: 1, student: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);