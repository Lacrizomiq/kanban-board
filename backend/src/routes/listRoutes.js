import express from "express";
import {
  createList,
  getLists,
  updateList,
  deleteList,
} from "../controllers/listController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { createListSchema, updateListSchema } from "../validations/schemas.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validateRequest({ body: createListSchema }),
  asyncHandler(createList)
);
router.get("/board/:boardId", asyncHandler(getLists));
router.put(
  "/:id",
  validateRequest({ body: updateListSchema }),
  asyncHandler(updateList)
);
router.delete("/:id", asyncHandler(deleteList));

export default router;
