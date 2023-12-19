import { randomBytes } from "crypto"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { executeQuery, pool, throwErrorIfFalsy } from "../utils/db"
import express from "express"
import { User } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

/**
 * ### 20文字のランダムなaccountNameを生成
 * - 20文字のランダムなaccountNameを生成
 * - 重複チェックあり
 */
export const craeteRandomAccountName = async () => {
    let accountName = randomBytes(10).toString("hex") // 20文字のランダムな文字列

    const isExist = await isExistAccountName(accountName) // 重複チェック

    if (isExist) {
        // 重複している場合は再度生成
        accountName = await craeteRandomAccountName()
    }

    return accountName
}

/**
 * ### accountNameの重複チェック
 */
export const isExistAccountName = async (accountName: User["accountName"]) => {
    const query = "SELECT 1 FROM users WHERE account_name = ? LIMIT 1"
    const results = await executeQuery<RowDataPacket[]>(query, [accountName])

    return results.length > 0
}

/**
 * ### 認証済みかどうかのチェック
 */
export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) {
        return next() // 認証されている場合は次の処理に移行
    }
    res.status(403).send("Forbidden") // 認証されていない場合はアクセスを拒否
}

/**
 * ### 管理者かどうかのチェック
 */
export const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated() && req.user?.isAdmin) {
        return next() // 管理者の場合は次の処理に移行
    }
    res.status(403).send("Forbidden") // 管理者以外のアクセスを拒否
}

/**
 * ### ユーザーを作成
 */
export const createUserModel = async (
    email: User["email"],
    accountName: User["accountName"],
    name: User["name"],
    googleId: User["googleId"] | null,
) => {
    const connection = await pool.getConnection()

    try {
        await connection.beginTransaction()

        // ユーザーを作成
        const userId = uuidv4() // uuidを生成
        const query = "INSERT INTO users (user_id, email, account_name, name, google_id) VALUES (?, ?, ?, ?, ?)"
        await executeQuery<ResultSetHeader>(query, [userId, email, accountName, name, googleId])

        // ユーザーを取得
        const user = await getUserModelByUserId(userId)
        throwErrorIfFalsy(user, "@createUserModel: Failed to create user.")

        await connection.commit()
        return user
    } catch (error) {
        await connection.rollback()
        if(error instanceof Error){
            throw new Error(`@createUserModel is error: ${error.message}`)
        } else {
            throw new Error("@createUserModel is error.")
        }
    } finally {
        connection.release() // 必ず接続を解放
    }
}


/**
 * ### ユーザーを取得
 * - userIdで取得
 */
export const getUserModelByUserId = async (userId: User["userId"]) => {
    try {
        const query = "SELECT * FROM users WHERE user_id = ?"
        const results = await executeQuery<RowDataPacket[]>(query, [userId])

        return results[0] as User
    } catch (error) {
        if(error instanceof Error){
            throw new Error(`@getUserModelByUserId is error: ${error.message}`)
        } else {
            throw new Error("@getUserModelByUserId is error.")
        }
    }
}

/**
 * ### ユーザーを取得
 * - accountNameで取得
 */
export const getUserModelByAccountName = async (accountName: User["accountName"]) => {
    try {
        const query = "SELECT * FROM users WHERE account_name = ?"
        const results = await executeQuery<RowDataPacket[]>(query, [accountName])

        return results[0] as User
    } catch (error) {
        if(error instanceof Error){
            throw new Error(`@getUserModelByAccountName is error: ${error.message}`)
        } else {
            throw new Error("@getUserModelByAccountName is error.")
        }
    }
}

/**
 * ### ユーザーを取得
 * - userNameで取得
 */
export const getUserModelByUserName = async (userName: User["name"]) => {
    try {
        const query = "SELECT * FROM users WHERE name = ?"
        const results = await executeQuery<RowDataPacket[]>(query, [userName])

        return results[0] as User
    } catch (error) {
        if(error instanceof Error){
            throw new Error(`@getUserModelByUserName is error: ${error.message}`)
        } else {
            throw new Error("@getUserModelByUserName is error.")
        }
    }
}

/**
 * ### ユーザーを更新
 * - userIdで更新
 */
export const updateUserModelByUserId = async (userId: User["userId"], name: User["name"] | null, accountName: User["accountName"] | null) => {
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        let query = "UPDATE users SET updated_at = CURRENT_TIMESTAMP"
        const params: string[] = []
        if (name) {
            query += ", name = ?"
            params.push(name)
        }
        if (accountName) {
            query += ", account_name = ?"
            params.push(accountName)
        }
        query = " WHERE user_id = ?"

        const results = await executeQuery<ResultSetHeader>(query, [...params, userId])
        throwErrorIfFalsy(results.affectedRows, "@updateUserModelByUserId: User not found")

        const user = await getUserModelByUserId(userId)
        return user
    } catch (error) {
        await connection.rollback()
        if(error instanceof Error){
            throw new Error(`@updateUserModelByUserId is error: ${error.message}`)
        } else {
            throw new Error("@updateUserModelByUserId is error.")
        }
    } finally {
        connection.release()
    }
}

/**
 * ### ユーザーを削除
 * - userIdで削除
 */
export const deleteUserModelByUserId = async (userId: User["userId"]) => {
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        const query = "UPDATE users SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
        const results = await executeQuery<ResultSetHeader>(query, [userId])
        throwErrorIfFalsy(results.affectedRows, "@deleteUserModelByUserId: User not found")

        await connection.commit()
        return true
    } catch (error) {
        await connection.rollback()
        if(error instanceof Error){
            throw new Error(`@deleteUserModelByUserId is error: ${error.message}`)
        } else {
            throw new Error("@deleteUserModelByUserId is error.")
        }
    }
}
