import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must be 200 characters or less"),
  description: z
    .string()
    .max(1000, "Task description must be 1000 characters or less")
    .optional(),
  listId: z.string().uuid("Invalid list ID"),
  dueDate: z.string().datetime().optional(),
  tagId: z.string().uuid("Invalid tag ID").optional(),
  assigneeId: z.string().uuid("Invalid assignee ID").optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});

export const assignTaskSchema = z.object({
  assigneeId: z.string().uuid("Invalid assignee ID"),
});
