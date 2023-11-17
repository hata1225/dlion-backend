import prisma from '../utils/db';

class TodoModel {
  static async getAllTodos() {
    return prisma.todo.findMany();
  }

  static async getTodoById(id: number) {
    return prisma.todo.findUnique({
      where: { id }
    });
  }

  static async createTodo(title: string, description: string) {
    return prisma.todo.create({
      data: { title, description }
    });
  }

  static async updateTodo(id: number, title: string, description: string, completed: boolean) {
    return prisma.todo.update({
      where: { id },
      data: { title, description, completed }
    });
  }

  static async deleteTodo(id: number) {
    return prisma.todo.delete({
      where: { id }
    });
  }
}

export default TodoModel;
