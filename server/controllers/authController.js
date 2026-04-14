import {asyncHandler} from "../utils/asyncHandler.js"
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = asyncHandler(async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body;

  // 🔹 Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  // 🔹 Check user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  // 🔹 Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // 🔹 Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 🔹 Response
  res.status(200).json({
    message: "Login successful",
    token,
    role: user.role,
  });
});