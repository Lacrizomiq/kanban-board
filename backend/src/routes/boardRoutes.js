import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  getBoardUsers,
} from "../controllers/boardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createBoardSchema,
  updateBoardSchema,
} from "../validations/boardSchemas.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(createBoardSchema), createBoard);
router.get("/", getBoards);
router.get("/:id", getBoardById);
router.put("/:id", validateRequest(updateBoardSchema), updateBoard);
router.delete("/:id", deleteBoard);
router.get("/:id/users", getBoardUsers);

export default router;

console.log("Board routes configured");
