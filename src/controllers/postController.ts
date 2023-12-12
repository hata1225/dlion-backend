import { Post, User } from "@prisma/client"
import { prisma } from "../utils/db"
import { isPostOwnedByUser } from "../models/post"

/**
 * ### 投稿を作成
 * - title, description, userIdを指定して投稿を作成
 * - title, descriptionのいずれかがnullの場合はエラー
 */
export const createPost = async (title: Post["title"], description: Post["description"], userId: Post["userId"]) => {

    if(!title || !description){
        throw new Error("title or description is null")
    }

    const post = await prisma.post.create({
        data: { title, description, userId }
    })

    return post
}

/**
 * ### 投稿を取得
 * - limit, offsetを指定して投稿を取得
 *     - limit: 取得する投稿の数
 *     - offset: 取得する投稿の開始位置
 *     - limit, offsetのいずれかがnullの場合はエラー
 * - 投稿は作成日時の降順で取得
 */
export const getPosts = async (limit?: string | number, offset?: string | number) => {

    if(!limit || !offset){
        throw new Error("limit or offset is null")
    }

    const posts = await prisma.post.findMany({
        take: limit ? Number(limit) : undefined,
        skip: offset ? Number(offset) : undefined,
        orderBy: { createdAt: "desc" },
        include: { user: true }
    })

    return posts
}

/**
 * ### 投稿を取得
 * - limit, offsetを指定して投稿を取得
 *    - limit: 取得する投稿の数
 *    - offset: 取得する投稿の開始位置
 *    - limit, offsetのいずれかがnullの場合はエラー
 * - userId, userName, userAccountNameのうち、いずれかを指定して投稿を取得
 *    - 2つ以上指定されている場合はエラー
 *    - userId, userName, userAccountNameすべてがnullの場合はエラー
 */
export const getPostsByUser = async (userId?: User["userId"], userName?: User["name"], userAccountName?: User["accountName"], limit?: string | number, offset?: string | number) => {
    // userId, userName, userAccountNameすべてがnullの場合はエラー
    if(!userId && !userName && !userAccountName){
        throw new Error("userId, userName, userAccountName are all null")
    }

    // 2つ以上指定されている場合はエラー
    if((userId && userName) || (userId && userAccountName) || (userName && userAccountName)){
        throw new Error("userId, userName, userAccountName are all not null")
    }

    // limit, offsetのいずれかがnullの場合はエラー
    if(!limit || !offset){
        throw new Error("limit or offset is null")
    }

    const posts = await prisma.post.findMany({
        where: {
            userId: userId ?? undefined,
            user: {
                name: userName ?? undefined,
                accountName: userAccountName ?? undefined
            }
        },
        take: limit ? Number(limit) : undefined,
        skip: offset ? Number(offset) : undefined,
        orderBy: { createdAt: "desc" },
        include: { user: true }
    })

    return posts
}

/**
 * ### 投稿を取得
 * - idで投稿を取得
 */
export const getPostByPostId = async (postId?: Post["postId"]) => {

    if(!postId){
        throw new Error("postId is null")
    }

    const post = await prisma.post.findUnique({
        where: { postId },
        include: { user: true }
    })

    if(!post){
        throw new Error("Post not found")
    }

    return post
}

/**
 * ### 投稿を削除
 * - deletedAtを更新
 * - 自分自身の投稿のみ削除可能
 *     - 自分自身の投稿かどうかのチェックを行う
 */
export const deletePostByPostId = async (postId?: Post["postId"], userId?: Post["userId"]) => {

    if(!postId){
        throw new Error("postId is null")
    }

    if(!userId){
        throw new Error("userId is null")
    }

    const isMyPost = await isPostOwnedByUser(postId, userId)

    if(!isMyPost){
        throw new Error("This is not my post")
    }

    const post = await prisma.post.update({
        where: { postId },
        data: { deletedAt: new Date() }
    })

    if(!post){
        throw new Error("Post not found")
    }

    return post
}


/**
 * ### 投稿を更新
 * - title, descriptionを更新
 * - title, descriptionのいずれかがnullの場合はエラー
 * - 自分自身の投稿のみ削除可能
 *     - 自分自身の投稿かどうかのチェックを行う
 */
export const updatePostByPostId = async (postId?: Post["postId"], userId?: User["userId"], title?: Post["title"], description?: Post["description"]) => {

    if(!postId){
        throw new Error("postId is null")
    }

    if(!title || !description){
        throw new Error("title or description is null")
    }

    const isMyPost = await isPostOwnedByUser(postId, userId)

    if(!isMyPost){
        throw new Error("This is not my post")
    }

    const post = await prisma.post.update({
        where: { postId },
        data: { title, description }
    })

    if(!post){
        throw new Error("Post not found")
    }

    return post
}
