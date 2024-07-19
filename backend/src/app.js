import express from "express";
import cors from "cors";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorMiddleware, notFound } from "./middleware/errorMiddleware.js";

const app = express();

// Enable CORS
app.use(cors());

// Enable JSON parsing
app.use(express.json());

// Routes registration
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tags", tagRoutes);

// Middleware for handling not found routes
app.use(notFound);

// Middleware for error handling
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
