import { prisma } from "../utils/db"
import { craeteRandomAccountName, isExistAccountName } from "../models/user"
import { User } from "@prisma/client"

/**
 * ### ユーザーを作成
 * - ユーザーを作成
 * - accountNameは20文字のランダムな文字列
 * - 重複チェックあり
 * - googleIdがある場合はgoogleIdを保存
*/
export const createUser = async ( email: User["email"], accountName: User["accountName"] | null, name: User["name"], googleId: User["googleId"] | null) => {
    if(!accountName){
        // accountNameがない場合は20文字のランダムな文字列を生成
        accountName = await craeteRandomAccountName()
    }

    const isExist = await isExistAccountName(accountName) // 重複チェック

    if(isExist) throw new Error("Account name already exists")

    const user = await prisma.user.create({
        data: { email, accountName, name, googleId }
    })

    return user
}

/**
 * ### ユーザーを取得
 * - ユーザーを取得
 * - idで取得
*/
export const getUserById = async ( userId: User["userId"] ) => {
    const user = await prisma.user.findUnique({
        where: { userId }
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
export const getUserByAccountName = async ( accountName: User["accountName"] ) => {
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
export const updateUserById = async ( userId: User["userId"], name: User["name"], accountName: User["accountName"] ) => {

    const isExist = await isExistAccountName(accountName) // 重複チェック

    if(isExist) throw new Error("Account name already exists")

    const user = await prisma.user.update({
        where: { userId },
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
export const deleteUserById = async ( userId: User["userId"] ) => {
    const user = await prisma.user.update({
        where: { userId },
        data: {deletedAt: new Date()}
    })

    if(!user) throw new Error("User not found")

    return user
}