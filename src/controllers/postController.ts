import { Post, User } from "@prisma/client"
import { prisma, throwErrorIfFalsy } from "../utils/db"
import { isPostOwnedByUser, createPostModel, getPostModelByPostId, getPostsModel, getPostsModelByUserId, getPostsModelByUserName, getPostsModelByAccountName, deletePostModelByPostId, updatePostModel } from "../models/post"

/**
 * ### 投稿を作成
 * - title, description, userIdを指定して投稿を作成
 */
export const createPost = async (title: Post["title"], description: Post["description"], userId: Post["userId"]) => {
    try {
        if(title === null){
            title = ""
        }
        if(description === null){
            description = ""
        }

        const post = await createPostModel(userId, title, description)

        return post
    } catch (error) {
        throw error
    }
}

/**
 * ### 投稿を取得
 * - limit, offsetを指定して投稿を取得
 *     - limit: 取得する投稿の数
 *     - offset: 取得する投稿の開始位置
 * - 投稿は作成日時の降順で取得
 */
export const getPosts = async (limit: string|number, offset: string|number) => {
    try {
        const posts = await getPostsModel(limit, offset)

        return posts
    } catch (error) {
        throw error
    }
}

/**
 * ### 投稿を取得
 * - limit, offsetを指定して投稿を取得
 *    - limit: 取得する投稿の数
 *    - offset: 取得する投稿の開始位置
 * - userIdを指定して投稿を取得
 */
export const getPostsByUserId = async (userId: User["userId"], limit: string|number, offset: string|number) => {
    try {
        const posts = await getPostsModelByUserId(userId, limit, offset)

        return posts
    } catch (error) {
        throw error
    }
}

/**
 * ### 投稿を取得
 * - limit, offsetを指定して投稿を取得
 *    - limit: 取得する投稿の数
 *    - offset: 取得する投稿の開始位置
 * - userNameを指定して投稿を取得
 */
export const getPostsByUserName = async (userName: User["name"], limit: string|number, offset: string|number) => {
    try {
        const posts = await getPostsModelByUserName(userName, limit, offset)

        return posts
    } catch (error) {
        throw error
    }
}

/**
 * ### 投稿を取得
 * - limit, offsetを指定して投稿を取得
 *    - limit: 取得する投稿の数
 *    - offset: 取得する投稿の開始位置
 * - accountNameを指定して投稿を取得
 */
export const getPostsByAccountName = async (accountName: User["accountName"], limit: string|number, offset: string|number) => {
    try {
        const posts = await getPostsModelByAccountName(accountName, limit, offset)

        return posts
    } catch (error) {
        throw error
    }
}

/**
 * ### 投稿を取得
 * - idで投稿を取得
 */
export const getPostByPostId = async (postId: Post["postId"]) => {
    try {
        const post = await getPostModelByPostId(postId)

        return post
    } catch (error) {
        throw error
    }
}

/**
 * ### 投稿を削除
 * - deletedAtを更新
 * - 自分自身の投稿のみ削除可能
 *     - 自分自身の投稿かどうかのチェックを行う
 */
export const deletePostByPostId = async (postId: Post["postId"], userId: Post["userId"]) => {
    try {
        const isMyPost = await isPostOwnedByUser(postId, userId)
        throwErrorIfFalsy(isMyPost, "This is not my post")

        const isDeleted = await deletePostModelByPostId(postId)
        throwErrorIfFalsy(isDeleted, "Post not found")

        return isDeleted
    } catch (error) {
        throw error
    }
}


/**
 * ### 投稿を更新
 * - title, descriptionを更新
 * - title, descriptionのいずれかがnullの場合はエラー
 * - 自分自身の投稿のみ削除可能
 *     - 自分自身の投稿かどうかのチェックを行う
 */
export const updatePostByPostId = async (postId: Post["postId"], userId: User["userId"], title: Post["title"], description: Post["description"]) => {
    try {
        const isMyPost = await isPostOwnedByUser(postId, userId)
        throwErrorIfFalsy(isMyPost, "This is not my post")

        const post = await updatePostModel(postId, title, description)
        throwErrorIfFalsy(post, "Post not found")

        return post
    } catch (error) {
        throw error
    }
}
