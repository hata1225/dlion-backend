import { PrismaClient } from "@prisma/client"
import mysql from "mysql2/promise"
import { RowDataPacket, ResultSetHeader, ProcedureCallPacket } from "mysql2";

// .envファイルからデータベース設定を読み込む
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
})

export const prisma = new PrismaClient()

// データベースのクエリを実行する関数
export const executeQuery = async <T extends RowDataPacket[] | ResultSetHeader | RowDataPacket[][] | ProcedureCallPacket>(query: string, params: any[]): Promise<T> => {
  const [results] = await pool.execute<T>(query, params);
  return results;
};

// falsyな値の場合はエラーを投げる
export const throwErrorIfFalsy = (value: any, message: string) => {
  if (!value) {
    throw new Error(message)
  }
}