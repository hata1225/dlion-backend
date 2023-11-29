import { Request, Response } from "express";
import TodoModel from "../models/todoModel";

class TodoController {
  static async getAllTodos(req: Request, res: Response) {
    const todos = await TodoModel.getAllTodos();
    res.json(todos);
  }

  static async getTodoById(req: Request, res: Response) {
    const todo = await TodoModel.getTodoById(req.params.id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).send("Todo not found");
    }
  }

  static async createTodo(req: Request, res: Response) {
    const { title, description } = req.body;
    const newTodo = await TodoModel.createTodo(title, description);
    res.json(newTodo);
  }

  static async updateTodo(req: Request, res: Response) {
    const { id, title, description, completed } = req.body;
    const updatedTodo = await TodoModel.updateTodo(
      id,
      title,
      description,
      completed
    );
    res.json(updatedTodo);
  }

  static async deleteTodo(req: Request, res: Response) {
    await TodoModel.deleteTodo(req.params.id);
    res.status(204).send();
  }
}

export default TodoController;
