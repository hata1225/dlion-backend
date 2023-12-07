import express from "express";
import TodoController from "controllers/todoController";

const router = express.Router();

router.get("/", TodoController.getAllTodos);
router.get("/:id", TodoController.getTodoById);
router.post("/", TodoController.createTodo);
router.put("/:id", TodoController.updateTodo);
router.delete("/:id", TodoController.deleteTodo);

export default router;
