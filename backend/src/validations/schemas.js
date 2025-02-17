import { z } from "zod";

// List schemas
export const createListSchema = z.object({
  name: z
    .string()
    .min(1, "List name is required")
    .max(100, "List name must be 100 characters or less"),
  boardId: z.string().uuid("Invalid board ID"),
});

export const updateListSchema = z.object({
  name: z
    .string()
    .min(1, "List name is required")
    .max(100, "List name must be 100 characters or less")
    .optional(),
  order: z.number().int().min(0).optional(),
});

// Task schemas
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
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});
