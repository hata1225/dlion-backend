import { PrismaClient } from "@prisma/client";
import mysql from "mysql2/promise";

// .envファイルからデータベース設定を読み込む
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const prisma = new PrismaClient();

export { pool, prisma };
