import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

const prisma = new PrismaClient();

export const createBoard = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  const board = await prisma.board.create({
    data: {
      name,
      ownerId: userId,
    },
  });

  res.status(201).json(board);
});

export const getBoards = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const boards = await prisma.board.findMany({
    where: {
      OR: [{ ownerId: userId }, { sharedWith: { some: { userId: userId } } }],
    },
  });

  res.json(boards);
});

export const getBoardById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const board = await prisma.board.findFirst({
    where: {
      id,
      OR: [{ ownerId: userId }, { sharedWith: { some: { userId: userId } } }],
    },
    include: {
      lists: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  res.json(board);
});

export const updateBoard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  const board = await prisma.board.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });

  if (!board) {
    throw new ApiError(
      404,
      "Board not found or you do not have permission to update it"
    );
  }

  const updateBoard = await prisma.board.update({
    where: { id },
    data: { name },
  });

  res.json(updateBoard);
});

export const deleteBoard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const board = await prisma.board.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });

  if (!board) {
    throw new ApiError(
      404,
      "Board not found or you do not have permission to delete it"
    );
  }

  await prisma.board.delete({ where: { id } });

  res.status(204).end();
});
