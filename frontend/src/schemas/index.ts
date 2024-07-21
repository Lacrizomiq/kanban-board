import { z } from "zod";

// Déclaration des types de base
const baseUser = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(8),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

const baseBoard = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Board name cannot be empty"),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  ownerId: z.string().uuid(),
});

const baseList = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "List name cannot be empty"),
  order: z.number().int().nonnegative(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  boardId: z.string().uuid(),
});

const baseTask = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Task title cannot be empty"),
  description: z.string().optional(),
  completed: z.boolean(),
  dueDate: z.string().or(z.date()).optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  listId: z.string().uuid(),
  tagId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional(),
});

const baseTag = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Tag name cannot be empty"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
});

const baseUserBoards = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  boardId: z.string().uuid(),
  sharedAt: z.string().or(z.date()),
  role: z.enum(["viewer", "editor", "admin"]),
});

// Définition des schémas complets avec références circulaires
export const UserSchema: z.ZodType<User> = baseUser.extend({
  boards: z.lazy(() => z.array(BoardSchema)).optional(),
  sharedBoards: z.lazy(() => z.array(UserBoardsSchema)).optional(),
  assignedTasks: z.lazy(() => z.array(TaskSchema)).optional(),
});

export const BoardSchema: z.ZodType<Board> = baseBoard.extend({
  owner: z.lazy(() => UserSchema),
  lists: z.lazy(() => z.array(ListSchema)).optional(),
  sharedWith: z.lazy(() => z.array(UserBoardsSchema)).optional(),
});

export const ListSchema: z.ZodType<List> = baseList.extend({
  board: z.lazy(() => BoardSchema),
  tasks: z.lazy(() => z.array(TaskSchema)).optional(),
});

export const TaskSchema: z.ZodType<Task> = baseTask.extend({
  list: z.lazy(() => ListSchema),
  tag: z.lazy(() => TagSchema).optional(),
  assignee: z.lazy(() => UserSchema).optional(),
});

export const TagSchema: z.ZodType<Tag> = baseTag.extend({
  tasks: z.lazy(() => z.array(TaskSchema)).optional(),
});

export const UserBoardsSchema: z.ZodType<UserBoards> = baseUserBoards.extend({
  user: z.lazy(() => UserSchema),
  board: z.lazy(() => BoardSchema),
});

// Définition des types TypeScript
export type User = z.infer<typeof baseUser> & {
  boards?: Board[];
  sharedBoards?: UserBoards[];
  assignedTasks?: Task[];
};

export type Board = z.infer<typeof baseBoard> & {
  owner: User;
  lists?: List[];
  sharedWith?: UserBoards[];
};

export type List = z.infer<typeof baseList> & {
  board: Board;
  tasks?: Task[];
};

export type Task = z.infer<typeof baseTask> & {
  list: List;
  tag?: Tag;
  assignee?: User;
};

export type Tag = z.infer<typeof baseTag> & {
  tasks?: Task[];
};

export type UserBoards = z.infer<typeof baseUserBoards> & {
  user: User;
  board: Board;
};
