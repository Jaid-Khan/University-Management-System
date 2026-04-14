import express from "express";
import {
  createCourse,
  getCourses,
  assignTeacher,
  getCourseStudents,
  enrollStudent,
} from "../controllers/courseController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("admin"), createCourse);
router.get("/", authMiddleware, getCourses);
router.post(
  "/:id/assign-teacher",
  authMiddleware,
  roleMiddleware("admin"),
  assignTeacher,
);
router.get("/:id/students", getCourseStudents);
router.post(
  "/:id/enroll",
  authMiddleware,
  roleMiddleware("admin"),
  enrollStudent,
);
export default router;
