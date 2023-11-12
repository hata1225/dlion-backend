import mysql, { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

// MySQLコネクションプールの設定
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export class User {
  // UserをIDで検索
  static async findById(id: number): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Users WHERE id = ?",
      [id]
    );
    return rows;
  }

  // 新しいUserを作成
  static async create(data: {
    name: string;
    email: string;
  }): Promise<RowDataPacket[]> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO Users SET ?",
      data
    );
    return this.findById(result.insertId);
  }

  // User情報を更新
  static async updateById(
    id: number,
    data: { name: string; email: string }
  ): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE Users SET ? WHERE id = ?",
      [data, id]
    );
    return result.affectedRows > 0;
  }

  // Userを削除
  static async deleteById(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM Users WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}
