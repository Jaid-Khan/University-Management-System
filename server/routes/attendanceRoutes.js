import express from "express";
import {
  markAttendance,
  markBulkAttendance,
  getStudentAttendance,
  getAttendancePercentage,
} from "../controllers/attendanceController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🔥 Teacher only
router.post("/", authMiddleware, roleMiddleware("teacher"), markAttendance);

router.post("/bulk", authMiddleware, roleMiddleware("teacher"), markBulkAttendance);

// 🔥 Analytics (Teacher + Admin)
router.get(
  "/percentage/:studentId/:courseId",
  authMiddleware,
  roleMiddleware("teacher", "admin"),
  getAttendancePercentage
);

// 🔥 Student view
router.get("/:studentId", authMiddleware, getStudentAttendance);

export default router;