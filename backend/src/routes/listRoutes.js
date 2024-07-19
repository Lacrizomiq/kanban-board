import express from "express";
import {
  createList,
  getLists,
  updateList,
  deleteList,
} from "../controllers/listController";
import { authMiddleware } from "../middleware/authMiddleware";
import asyncHandler from "../utils/asyncHandler";
import validateRequest from "../middleware/validateRequest";
import { createListSchema, updateListSchema } from "../validations/schemas";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validateRequest({ body: createListSchema }),
  asyncHandler(createList)
);
router.get("/:boardId", asyncHandler(getLists));
router.put(
  "/:id",
  validateRequest({ body: updateListSchema }),
  asyncHandler(updateList)
);
router.delete("/:id", asyncHandler(deleteList));

export default router;
