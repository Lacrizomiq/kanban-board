import ApiError from "../utils/apiError.js";

export const errorMiddleware = (err, req, res, next) => {
  console.error("Error caught in middleware:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  const response = {
    success: false,
    statusCode,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  console.log("Sending error response:", response);
  res.status(statusCode).json(response);
};

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};
