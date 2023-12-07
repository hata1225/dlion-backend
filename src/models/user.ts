import { randomBytes } from "crypto"
import { RowDataPacket } from "mysql2"
import { pool } from "utils/db"


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
const isExistAccountName = async (accountName: string) => {
    const query = "SELECT 1 FROM users WHERE account_name = ? LIMIT 1"
    const [results] = await pool.execute<RowDataPacket[]>(query, [accountName])

    return results.length > 0
}