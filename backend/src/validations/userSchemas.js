import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  boardId: z.string().uuid("Invalid board ID"),
});
