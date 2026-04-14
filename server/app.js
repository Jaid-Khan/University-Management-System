// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
// import resultRoutes from "./routes/resultRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// 🔹 Load correct env file
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const app = express();

// 🔹 Middlewares
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  process.env.FRONTEND_URL // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
}));
app.use(express.json());

// 🔹 Routes
app.get("/", (req, res) => {
  res.send("This is Home Page");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);
// app.use("/api/results", resultRoutes);

// 🔹 Error Handler (ALWAYS LAST)
app.use(errorHandler);

export default app;