/*
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

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
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
*/

// src/routes/userRoutes.js

import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updateUser,
  inviteUserToBoard,
  getUserBoards,
  updateBoardAccess,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.use(authMiddleware);
router.get("/me", getCurrentUser);
router.put("/", updateUser);
router.post("/invite", inviteUserToBoard);
router.get("/boards", getUserBoards);
router.post("/boards/access", updateBoardAccess);

export default router;
