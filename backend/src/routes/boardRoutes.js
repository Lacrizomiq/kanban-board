import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController";
import asyncHandler from "../utils/asyncHandler";
import authMiddleware from "../middleware/authMiddleware";
import validateRequest from "../middleware/validateRequest";
import { createBoardSchema, updateBoardSchema } from "../validations/schemas";

const router = express.Router();
router.use(authMiddleware);

router.post(
  "/",
  validateRequest({ body: createBoardSchema }),
  asyncHandler(createBoard)
);
router.get("/", asyncHandler(getBoards));
router.get("/:id", asyncHandler(getBoardById));
router.put(
  "/:id",
  validateRequest({ body: updateBoardSchema }),
  asyncHandler(updateBoard)
);
router.delete("/:id", asyncHandler(deleteBoard));

export default router;
