import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";

// 🔹 Create User (Admin only)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // Create user (password auto hashed)
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // 🔥 Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: userResponse,
  });
});

// 🔹 Get All Users (Admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});