import express from "express";
import {
  addResult,
  getStudentResults,
  getCourseResults,
} from "../controllers/resultController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🔥 Teacher only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("teacher"),
  addResult
);

// 🔥 Student view
router.get(
  "/student/:studentId",
  authMiddleware,
  getStudentResults
);

// 🔥 Course results (teacher/admin)
router.get(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("teacher", "admin"),
  getCourseResults
);

export default router;