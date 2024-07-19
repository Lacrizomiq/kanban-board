import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async (req, res, next) => {
  const { title, description, listId, dueDate } = req.body;
  const userId = req.user.id;

  // Verifie que l'utilisateur a accès à la liste
  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
    include: {
      board: true,
    },
  });

  if (!list) {
    return next(ApiError);
  }

  if (
    list.board.userId !== userId &&
    !list.board.sharedWith.some((ub) => ub.userId === userId)
  ) {
    throw new ApiError(
      403,
      "You do not have permission to add tasks to this list"
    );
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      listId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  });

  res.status(201).json(task);
};

export const getTasks = async (req, res, next) => {
  const { listId } = req.params;
  const userId = req.user.id;

  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
    include: {
      list: true,
    },
  });

  if (!list) {
    throw new ApiError(404, "List not found");
  }

  if (
    list.board.ownerId !== userId &&
    !list.board.sharedWith.some((ub) => ub.userId === userId)
  ) {
    throw new ApiError(
      403,
      "You do not have permission to view tasks in this list"
    );
  }

  const tasks = await prisma.task.findMany({
    where: {
      listId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(tasks);
};

export const getTaskById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
    include: { list: { include: { board: true } } },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (
    task.list.board.ownerId !== userId &&
    !task.list.board.sharedWith.some((ub) => ub.userId === userId)
  ) {
    throw new ApiError(403, "You do not have permission to view this task");
  }

  res.json(task);
};

export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;
  const userId = req.user.id;

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
    include: { list: { include: { board: true } } },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (
    task.list.board.ownerId !== userId &&
    !task.list.board.sharedWith.some((ub) => ub.userId === userId)
  ) {
    throw new ApiError(403, "You do not have permission to update this task");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  });

  res.json(updatedTask);
};

export const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
    include: { list: { include: { board: true } } },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (
    task.list.board.ownerId !== userId &&
    !task.list.board.sharedWith.some((ub) => ub.userId === userId)
  ) {
    throw new ApiError(403, "You do not have permission to delete this task");
  }

  await prisma.task.delete({
    where: {
      id,
    },
  });

  res.status(204).end();
};
