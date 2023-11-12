import { Request, Response } from "express";
import { User } from "../models/userModel";

// Userを作成
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    const message = (error as Error).message;
    res.status(400).json({ message });
  }
};

// Userを取得
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message });
  }
};
