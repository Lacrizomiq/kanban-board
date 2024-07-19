// src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid token"));
  }
};
