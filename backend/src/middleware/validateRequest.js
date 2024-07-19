import { z } from "zod";
import ApiError from "../utils/apiError.js";

const validateRequest = (schema) => (req, res, next) => {
  console.log("validateRequest middleware called");
  console.log("Request body:", req.body);
  console.log("Validation schema:", schema);

  if (!schema || !schema.body) {
    console.log("No schema provided for validation");
    return next();
  }

  try {
    const validData = schema.body.parse(req.body);
    req.body = validData;
    console.log("Validation successful. Result:", validData);
    next();
  } catch (error) {
    console.error("Validation error:", error);

    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      console.log("Zod validation errors:", errorMessages);
      next(new ApiError(400, "Validation failed", errorMessages));
    } else {
      console.log("Unexpected error during validation:", error);
      next(
        new ApiError(500, "Internal Server Error", [{ message: error.message }])
      );
    }
  }
};

export default validateRequest;
