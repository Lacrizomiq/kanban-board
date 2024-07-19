import { Schema } from "zod";
import ApiError from "../utils/apiError.js";

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const errors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    next(ApiError.badRequest("Validation failed", errors));
  }
};

export default validateRequest;
