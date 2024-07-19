import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createBoardSchema,
  updateBoardSchema,
} from "../validations/boardSchemas.js";
import asyncHandler from "../utils/asyncHandler.js";

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
