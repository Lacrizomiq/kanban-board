import express from "express";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorMiddleware, notFound } from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tags", tagRoutes);

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware pour les erreurs
app.use(errorMiddleware);

export default app;
