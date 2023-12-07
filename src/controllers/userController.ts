import { prisma } from "utils/db"
import { craeteRandomAccountName } from "models/user"

/**
 * ### ユーザーを作成
 * - ユーザーを作成
 * - accountNameは20文字のランダムな文字列
 * - 重複チェックあり
 * - googleIdがある場合はgoogleIdを保存
*/
export const createUser = async ( email: string, accountName: string | null, name: string, googleId: string | null) => {
    if(!accountName){
        // accountNameがない場合は20文字のランダムな文字列を生成
        accountName = await craeteRandomAccountName()
    }

    return await prisma.user.create({
        data: {
            accountName,
            email,
            name,
            googleId
        }
    })
}