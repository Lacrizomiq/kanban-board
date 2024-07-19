import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError.js";

const prisma = new PrismaClient();

export const createTag = async (req, res) => {
  const { name, color } = req.body;

  const tag = await prisma.tag.create({
    data: {
      name,
      color,
    },
  });

  res.status(201).json(tag);
};

export const getTags = async (req, res) => {
  const tags = await prisma.tag.findMany();
  res.status(200).json(tags);
};

export const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;

  const tag = await prisma.tag.update({
    where: { id },
    data: { name, color },
  });

  res.json(tag);
};

export const deleteTag = async (req, res) => {
  const { id } = req.params;
  await prisma.tag.delete({ where: { id } });

  res.status(204).send();
};
