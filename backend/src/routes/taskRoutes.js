import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchema.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validateRequest({ body: createTaskSchema }),
  asyncHandler(createTask)
);
router.get("/list/:listId", asyncHandler(getTasks));
router.get("/:id", asyncHandler(getTaskById));
router.put(
  "/:id",
  validateRequest({ body: updateTaskSchema }),
  asyncHandler(updateTask)
);
router.delete("/:id", asyncHandler(deleteTask));

export default router;
