import { prisma } from "../utils/db"
import { craeteRandomAccountName, isExistAccountName } from "../models/user"

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

/**
 * ### ユーザーを取得
 * - ユーザーを取得
 * - idで取得
*/
export const getUserById = async ( id: string ) => {
    const user = await prisma.user.findUnique({
        where: { id }
    })

    if(!user){
        throw new Error("User not found")
    }

    return user
}

/**
 * ### ユーザーを取得
 * - ユーザーを取得
 * - accountNameで取得
*/
export const getUserByAccountName = async ( accountName: string ) => {
    const user = await prisma.user.findUnique({
        where: { accountName }
    })

    if(!user){
        throw new Error("User not found")
    }

    return user
}

/**
 * ### ユーザーを更新
 * - ユーザーを更新
 * - idで更新
*/
export const updateUserById = async ( id: string, name: string, accountName: string ) => {

    const isExist = await isExistAccountName(accountName) // 重複チェック

    if(isExist) throw new Error("Account name already exists")

    const user = await prisma.user.update({
        where: { id },
        data: { name, accountName }
    })

    if(!user) throw new Error("User not found")

    return user
}

/**
 * ### ユーザーを削除
 * - ユーザーを削除
 * - idで削除
*/
export const deleteUserById = async ( id: string ) => {
    const user = await prisma.user.update({
        where: { id },
        data: {deletedAt: new Date()}
    })

    if(!user) throw new Error("User not found")

    return user
}