import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError.js";

const prisma = new PrismaClient();

const checkBoardAccess = async (userId, boardId, requiredRole) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { sharedWith: { where: { userId } } },
  });

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  if (board.ownerId === userId) return true;

  const userRole = board.sharedWith[0]?.role;

  if (!userRole) {
    throw new ApiError(403, "You do not have access to this board");
  }

  const roles = ["viewer", "editor", "admin"];
  return roles.indexOf(userRole) >= roles.indexOf(requiredRole);
};

export const createList = async (req, res) => {
  const { name, boardId } = req.body;
  const userId = req.user.id;

  await checkBoardAccess(userId, boardId, "editor");

  const list = await prisma.list.create({
    data: {
      name,
      boardId,
      order: await prisma.list.count({ where: { boardId } }),
    },
  });

  res.status(201).json(list);
};

export const getLists = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;

  await checkBoardAccess(userId, boardId, "viewer");

  const lists = await prisma.list.findMany({
    where: { boardId },
    orderBy: { order: "asc" },
    include: { tasks: true },
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

  await checkBoardAccess(userId, list.boardId, "editor");

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

  await checkBoardAccess(userId, list.boardId, "editor");

  await prisma.list.delete({ where: { id } });

  res.status(204).send();
};
