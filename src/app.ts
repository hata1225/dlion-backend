import express from "express";
import todoRoutes from "./routes/todoRoutes";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/todos", todoRoutes);

export default app;
