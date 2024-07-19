import { z } from "zod";

export const registerUserSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    name: z.string().optional(),
  }),
};

console.log("registerUserSchema defined:", registerUserSchema);

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
  role: z.enum(["viewer", "editor", "admin"]).default("viewer"),
});

export const updateBoardAccessSchema = z.object({
  boardId: z.string().uuid("Invalid board ID"),
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(["viewer", "editor", "admin"]),
});
