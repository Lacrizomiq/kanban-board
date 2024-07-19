import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log("Authorization Header:", req.header("Authorization"));
  console.log("Token:", token);

  if (!token) {
    console.log("No Token Provided");
    return next(new ApiError(401, "Not authorized to access this route"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    console.log("Decoded Token:", decoded);
    next();
  } catch (err) {
    console.log("Invalid Token:", err.message);
    return next(new ApiError(401, "Invalid token"));
  }
};
