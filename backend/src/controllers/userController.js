import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res
    .status(201)
    .json({ user: { id: user.id, email: user.email, name: user.name }, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
};

export const getCurrentUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(user);
};

export const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  let updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: { id: true, email: true, name: true },
  });

  res.json(user);
};

export const inviteUserToBoard = async (req, res) => {
  const { email, boardId } = req.body;
  const inviterId = req.user.id;

  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  if (board.ownerId !== inviterId) {
    throw new ApiError(
      403,
      "You do not have permission to invite users to this board"
    );
  }

  const invitedUser = await prisma.user.findUnique({ where: { email } });
  if (!invitedUser) {
    throw new ApiError(404, "Invited user not found");
  }

  const existingInvite = await prisma.usersBoards.findUnique({
    where: {
      userId_boardId: {
        userId: invitedUser.id,
        boardId,
      },
    },
  });

  if (existingInvite) {
    throw new ApiError(400, "User already has access to this board");
  }

  const invitation = await prisma.usersBoards.create({
    data: {
      userId: invitedUser.id,
      boardId,
    },
  });

  res.status(201).json({ message: "Invitation sent successfully" });
};
