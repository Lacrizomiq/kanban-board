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
  const {
    title,
    description,
    listId,
    order,
    completed,
    dueDate,
    tagId,
    assigneeId,
  } = req.body;
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
      order,
      completed,
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
  const { listId, order, ...updateData } = req.body;
  const userId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { list: { include: { board: true } } },
    });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    await checkBoardAccess(userId, task.list.boardId, "editor");

    // Filtrer les champs undefined ou null
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // Si la tâche change de liste, mettez à jour l'ordre de toutes les tâches affectées
    if (listId && listId !== task.listId) {
      await prisma.$transaction(async (prisma) => {
        // Décrémenter l'ordre des tâches dans l'ancienne liste
        await prisma.task.updateMany({
          where: { listId: task.listId, order: { gt: task.order } },
          data: { order: { decrement: 1 } },
        });

        // Incrémenter l'ordre des tâches dans la nouvelle liste
        if (order !== undefined) {
          await prisma.task.updateMany({
            where: { listId, order: { gte: order } },
            data: { order: { increment: 1 } },
          });
        }

        // Mettre à jour la tâche
        const updatedTask = await prisma.task.update({
          where: { id },
          data: {
            ...filteredUpdateData,
            listId,
            order: order !== undefined ? order : undefined,
          },
        });

        res.json(updatedTask);
      });
    } else {
      // Si la tâche reste dans la même liste, mettez simplement à jour ses données
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          ...filteredUpdateData,
          order: order !== undefined ? order : undefined,
        },
      });

      res.json(updatedTask);
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
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
