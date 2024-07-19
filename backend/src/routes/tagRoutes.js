import express from "express";
import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} from "../controllers/tagController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { createTagSchema, updateTagSchema } from "../validations/tagSchemas.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validateRequest({ body: createTagSchema }),
  asyncHandler(createTag)
);
router.get("/", asyncHandler(getTags));
router.put(
  "/:id",
  validateRequest({ body: updateTagSchema }),
  asyncHandler(updateTag)
);
router.delete("/:id", asyncHandler(deleteTag));

export default router;
