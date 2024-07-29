import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();

const createDefaultLists = async (boardId) => {
  const defaultLists = [
    { name: "To do", order: 1 },
    { name: "In progress", order: 2 },
    { name: "Done", order: 3 },
  ];
  await prisma.list.createMany({
    data: defaultLists.map((list) => ({ ...list, boardId })),
  });
};

export const createBoard = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const board = await prisma.board.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    await createDefaultLists(board.id);

    // Récupérer le board avec ses listes
    const boardWithLists = await prisma.board.findUnique({
      where: { id: board.id },
      include: { lists: true },
    });

    res.status(201).json(boardWithLists);
  } catch (error) {
    console.error("Error in createBoard:", error);
    next(new ApiError(500, "Failed to create board", error.message));
  }
};

export const getBoards = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const boards = await prisma.board.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      lists: {
        include: {
          tasks: true,
        },
      },
    },
  });

  console.log("Boards:", boards);

  res.json(boards);
});

export const getBoardById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await prisma.board.findFirst({
      where: {
        id,
        OR: [{ ownerId: userId }, { sharedWith: { some: { userId: userId } } }],
      },
      include: {
        lists: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(board);
  } catch (error) {
    next(error);
  }
};

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

export const deleteBoard = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const board = await prisma.board.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!board) {
      throw new ApiError(
        404,
        "Board not found or you don't have permission to delete it"
      );
    }

    await prisma.list.deleteMany({
      where: { boardId: id },
    });

    await prisma.board.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteBoard:", error);
    next(new ApiError(500, "Failed to delete board", error.message));
  }
};

export const getBoardUsers = asyncHandler(async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user.id;

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        OR: [{ ownerId: userId }, { sharedWith: { some: { userId } } }],
      },
      include: {
        sharedWith: {
          where: { userId },
          select: { role: true },
        },
      },
    });

    if (!board) {
      throw new ApiError(404, "Board not found");
    }

    const boardUsers = await prisma.user.findMany({
      where: {
        OR: [
          { id: board.ownerId },
          { sharedBoards: { some: { boardId: id } } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json(boardUsers);
  } catch (error) {
    next(error);
  }
});
