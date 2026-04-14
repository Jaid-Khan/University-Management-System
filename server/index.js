// index.js
import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// 🔹 Load env
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

// 🔹 Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});