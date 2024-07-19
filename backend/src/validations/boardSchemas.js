import { z } from "zod";

export const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .max(100, "Board name must be 100 characters or less"),
});

export const updateBoardSchema = createBoardSchema.partial();
