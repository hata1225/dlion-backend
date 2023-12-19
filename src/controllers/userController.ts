import { prisma, throwErrorIfFalsy } from "../utils/db"
import { craeteRandomAccountName, createUserModel, getUserModelByAccountName, getUserModelByUserId, isExistAccountName, getUserModelByUserName, updateUserModelByUserId, deleteUserModelByUserId } from "../models/user"
import { User } from "@prisma/client"

/**
 * ### ユーザーを作成
 * - ユーザーを作成
 * - accountNameは20文字のランダムな文字列
 * - 重複チェックあり
 * - googleIdがある場合はgoogleIdを保存
 */
export const createUser = async (
    email: User["email"],
    accountName: User["accountName"] | null,
    name: User["name"],
    googleId: User["googleId"] | null,
) => {
    try {
        // accountNameがない場合は20文字のランダムな文字列を生成
        if (!accountName) {
            accountName = await craeteRandomAccountName()
        }

        // 重複チェック
        const isExist = await isExistAccountName(accountName)
        throwErrorIfFalsy(!isExist, "Account name already exists")

        // ユーザーを作成
        const user = await createUserModel(email, accountName, name, googleId)
        return user
    } catch (error) {
        throw error
    }
}

/**
 * ### ユーザーを取得
 * - userIdで取得
 */
export const getUserByUserId = async (userId: User["userId"]) => {
    try {
        const user = await getUserModelByUserId(userId)

        return user
    } catch (error) {
        throw error
    }
}

/**
 * ### ユーザーを取得
 * - accountNameで取得
 */
export const getUserByAccountName = async (accountName: User["accountName"]) => {
    try {
        const user = await getUserModelByAccountName(accountName)

        return user
    } catch (error) {
        throw error
    }
}

/**
 * ### ユーザーを取得
 * - nameで取得
 */
export const getUserByUserName = async (name: User["name"]) => {
    try {
        const user = await getUserModelByUserName(name)

        return user
    } catch (error) {
        throw error
    }
}

/**
 * ### ユーザーを更新
 * - userIdで更新
 */
export const updateUserById = async (userId: User["userId"], name: User["name"], accountName: User["accountName"]) => {
    try {
        const user = await updateUserModelByUserId(userId, name, accountName)

        return user
    } catch (error) {
        throw error
    }
}

/**
 * ### ユーザーを削除
 * - userIdで削除
 */
export const deleteUserById = async (userId: User["userId"]) => {
    try {
        const isDeleted = await deleteUserModelByUserId(userId)

        return isDeleted
    } catch (error) {
        throw error
    }
}
