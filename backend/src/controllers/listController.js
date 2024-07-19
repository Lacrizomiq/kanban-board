import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError";

const prisma = new PrismaClient();

export const createList = async (req, res) => {
  const { boardId, name } = req.body;
  const userId = req.user.id;

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      OR: [{ ownerId: userId }, { sharedWith: { some: { userId: userId } } }],
    },
  });

  if (!board) {
    throw new ApiError(404, "Board not found or you do not have access to it");
  }

  const list = await prisma.list.create({
    data: {
      name,
      boardId,
      order: await prisma.list.count({
        where: { boardId },
      }),
    },
  });

  res.status(201).json(list);
};

export const getLists = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      OR: [{ ownerId: userId }, { sharedWith: { some: { userId: userId } } }],
    },
  });

  if (!board) {
    throw new ApiError(404, "Board not found or you do not have access to it");
  }

  const lists = await prisma.list.findMany({
    where: {
      boardId,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      tasks: true,
    },
  });

  res.json(lists);
};

export const updateList = async (req, res) => {
  const { id } = req.params;
  const { name, order } = req.body;
  const userId = req.user.id;

  const list = await prisma.list.findUnique({
    where: { id },
    include: { board: true },
  });

  if (!list) {
    throw new ApiError(404, "List not found");
  }

  if (
    list.board.ownerId !== userId &&
    !list.board.sharedWith.some((ub) => ub.userId === userId)
  ) {
    throw new ApiError(403, "You do not have permission to update this list");
  }

  const updatedList = await prisma.list.update({
    where: { id },
    data: { name, order },
  });

  res.json(updatedList);
};

export const deleteList = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const list = await prisma.list.findUnique({
    where: { id },
    include: { board: true },
  });

  if (!list) {
    throw new ApiError(404, "List not found");
  }

  if (
    list.board.ownerId !== userId &&
    !list.board.sharedWith.some((ub) => ub.userId === userId)
  ) {
    throw new ApiError(403, "You do not have permission to delete this list");
  }

  await prisma.list.delete({
    where: { id },
  });

  res.status(204).send();
};
