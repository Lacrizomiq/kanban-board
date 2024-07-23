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

export const createTask = async (req, res) => {
  const { title, description, listId, dueDate, tagId, assigneeId } = req.body;
  const userId = req.user.id;

  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: { board: true },
  });

  if (!list) {
    throw new ApiError(404, "List not found");
  }

  await checkBoardAccess(userId, list.boardId, "editor");

  const task = await prisma.task.create({
    data: {
      title,
      description,
      listId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tagId,
      assigneeId,
    },
    include: { tag: true, assignee: true },
  });

  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  const { listId } = req.params;
  const userId = req.user.id;

  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: { board: true },
  });

  if (!list) {
    throw new ApiError(404, "List not found");
  }

  await checkBoardAccess(userId, list.boardId, "viewer");

  const tasks = await prisma.task.findMany({
    where: { listId },
    orderBy: { createdAt: "asc" },
  });

  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, dueDate, listId, tagId, assigneeId } =
    req.body;
  const userId = req.user.id;

  const task = await prisma.task.findUnique({
    where: { id },
    include: { list: { include: { board: true } } },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await checkBoardAccess(userId, task.list.boardId, "editor");

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      completed,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      order,
      listId,
      tagId,
      assigneeId,
    },
    include: { tag: true, assignee: true },
  });

  res.json(updatedTask);
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const task = await prisma.task.findUnique({
    where: { id },
    include: { list: { include: { board: true } } },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await checkBoardAccess(userId, task.list.boardId, "editor");

  await prisma.task.delete({ where: { id } });

  res.status(204).send();
};

export const addTagToTask = async (req, res) => {
  const { taskId, tagId } = req.params;
  const userId = req.user.id;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { list: { include: { board: true } } },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await checkBoardAccess(userId, task.list.boardId, "editor");

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      tags: {
        connect: { id: tagId },
      },
    },
    include: { tags: true },
  });

  res.json(updatedTask);
};

export const removeTagFromTask = async (req, res) => {
  const { taskId, tagId } = req.params;
  const userId = req.user.id;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { list: { include: { board: true } } },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await checkBoardAccess(userId, task.list.boardId, "editor");

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      tags: {
        disconnect: { id: tagId },
      },
    },
    include: { tags: true },
  });

  res.json(updatedTask);
};

export const assignTask = async (req, res) => {
  const { id } = req.params;
  const { assigneeId } = req.body;
  const userId = req.user.id;

  const task = await prisma.task.findUnique({
    where: { id },
    include: { list: { include: { board: true } } },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await checkBoardAccess(userId, task.list.boardId, "editor");

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { assigneeId },
    include: { assignee: true },
  });

  res.json(updatedTask);
};
