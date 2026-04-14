// routes/userRoutes.js
import express from "express";
import { createUser, getUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin only
router.post("/", authMiddleware, roleMiddleware("admin"), createUser);
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);

export default router;