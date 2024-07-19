import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
} from "../validations/taskSchemas.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validateRequest({ body: createTaskSchema }),
  asyncHandler(createTask)
);
router.get("/list/:listId", asyncHandler(getTasks));
router.put(
  "/:id",
  validateRequest({ body: updateTaskSchema }),
  asyncHandler(updateTask)
);
router.delete("/:id", asyncHandler(deleteTask));
router.post(
  "/:id/assign",
  validateRequest({ body: assignTaskSchema }),
  asyncHandler(assignTask)
);

export default router;
