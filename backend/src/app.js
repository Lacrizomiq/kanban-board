import express from "express";
import boardRoutes from "./routes/boardRoutes";
import listRoutes from "./routes/listRoutes";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import { errorMiddleware, notFound } from "./middleware/errorMiddleware";

const app = express();

app.use(express.json());

// Routes
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware pour les erreurs
app.use(errorMiddleware);

export default app;
