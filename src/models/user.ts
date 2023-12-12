import { randomBytes } from "crypto"
import { RowDataPacket } from "mysql2"
import { pool } from "../utils/db"
import express from "express"
import { User } from "@prisma/client"

/**
 * ### 20文字のランダムなaccountNameを生成
 * - 20文字のランダムなaccountNameを生成
 * - 重複チェックあり
 */
export const craeteRandomAccountName = async () => {
    let accountName = randomBytes(10).toString('hex') // 20文字のランダムな文字列

    const isExist = await isExistAccountName(accountName) // 重複チェック

    if(isExist){
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
    const [results] = await pool.execute<RowDataPacket[]>(query, [accountName])

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