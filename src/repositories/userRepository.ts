import { User } from "@prisma/client"
import { executeQuery, pool } from "../utils/db"
import { RowDataPacket } from "mysql2"
import { PoolConnection } from "mysql2/promise"
import { randomBytes } from "crypto"

export class UserRepository {
    /**
     * ### ユーザーを取得
     * - read処理のベース
     */
    async get(key: "user_id"|"account_name"|"google_id", value: User["userId"]|User["accountName"]|User["googleId"]) {
        try{
            const query = `SELECT * FROM users WHERE ${key} = ?`
            const [results] = await executeQuery<RowDataPacket[]>(query, [value])
            const user: User | null = results?.length ? results[0] as User : null
            return user
        } catch (error) {
            throw error
        }
    }


    /**
     * ### ユーザーを作成
     */
    async create(userId: User["userId"], email: User["email"], accountName: User["accountName"], name: User["name"], googleId: User["googleId"]) {
        try {
            const query = "INSERT INTO users (user_id, email, account_name, name, google_id) VALUES (?, ?, ?, ?, ?)"
            await executeQuery(query, [userId, email, accountName, name, googleId])
        } catch (error) {
            throw error
        }
    }


    /**
     * ### ユーザーを更新
     * - userIdで更新
     * - fieldsToUpdateで更新するフィールドを指定
     *     - fieldsToUpdate: User型のフィールド
     */
    async update(userId: User["userId"], fieldsToUpdate: Partial<User>) {
        try {
            fieldsToUpdate.updatedAt = new Date() // updatedAtは更新する
            fieldsToUpdate.userId = userId // userIdは更新しない
            const entries = Object.entries(fieldsToUpdate) // [[key1, value1], [key2, value2], ...]
            const setClause = entries.map(([key, _]) => `${key} = ?`).join(', ') // "key1 = ?, key2 = ?, ..."
            const values = entries.map(([_key, value]) => value) // [value1, value2, ... ]

            const query = `UPDATE users SET ${setClause} WHERE user_id = ?`
            await executeQuery(query, [...values, fieldsToUpdate.userId])
        } catch (error) {
            throw error
        }
    }


    /**
     * ### ユーザーを削除
     * - userIdで削除
     */
    async delete(userId: string) {
        try {
            await this.update(userId, { deletedAt: new Date() })
        } catch (error) {
            throw error
        }
    }


    /**
     * ### 20文字のランダムな文字を生成
     */
    async createAccountNameBy20RandomBytes() {
        const bytes = await randomBytes(10)
        const accountName = bytes.toString("hex")
        return accountName
    }


    /**
     * ### accountNameの重複チェック
     */
    async isExistAccountName(accountName: User["accountName"]) {
        const query = "SELECT 1 FROM users WHERE account_name = ? LIMIT 1"
        const results = await executeQuery<RowDataPacket[]>(query, [accountName])

        return results.length > 0
    }


    async beginTransaction() {
        const connection: PoolConnection = await pool.getConnection()
        await connection.beginTransaction()
        return connection
    }

    async commit(connection: PoolConnection) {
        await connection.commit()
        connection.release()
    }

    async rollback(connection: PoolConnection) {
        await connection.rollback()
        connection.release()
    }
}
