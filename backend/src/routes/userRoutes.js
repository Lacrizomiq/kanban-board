import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updateUser,
  inviteUserToBoard,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  inviteUserSchema,
} from "../validations/userSchemas.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest({ body: registerUserSchema }),
  asyncHandler(register)
);
router.post(
  "/login",
  validateRequest({ body: loginUserSchema }),
  asyncHandler(login)
);

router.use(authMiddleware);

router.get("/me", asyncHandler(getCurrentUser));
router.put(
  "/me",
  validateRequest({ body: updateUserSchema }),
  asyncHandler(updateUser)
);
router.post(
  "/invite",
  validateRequest({ body: inviteUserSchema }),
  asyncHandler(inviteUserToBoard)
);

export default router;
