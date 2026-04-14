// middleware/roleMiddleware.js
export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // 🔹 Safety check (in case authMiddleware not used)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // 🔹 Role check
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied",
      });
    }

    next();
  };
};