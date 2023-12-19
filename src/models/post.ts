import { Post, User } from "@prisma/client";
import { executeQuery, pool, throwErrorIfFalsy } from "../utils/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";

/**
 * ### 自分自身の投稿かどうかのチェック
 */
export const isPostOwnedByUser = async (postId: Post["postId"], userId: Post["userId"]) => {
    try {
        const query = "SELECT 1 FROM posts WHERE post_id = ? AND user_id = ? LIMIT 1"
        const results = await executeQuery<RowDataPacket[]>(query, [postId, userId])

        return results.length > 0
    } catch (error) {
        if(error instanceof Error){
            throw new Error(`@isPostOwnedByUser is error: ${error.message}`);
        } else {
            throw new Error("@isPostOwnedByUser is error.");
        }
    }
}

/**
 * ### 投稿を取得
 * - idで取得
 */
export const getPostModelByPostId = async (postId: Post["postId"]) => {
    try {
        const query = "SELECT * FROM posts WHERE post_id = ?"
        const results = await executeQuery<RowDataPacket[]>(query, [postId])
        throwErrorIfFalsy(results.length, "@getPostModelByPostId: Post not found")

        return results[0] as Post
    } catch (error) {
        if(error instanceof Error){
            throw new Error(`@getPostModelByPostId is error: ${error.message}`);
        } else {
            throw new Error("@getPostModelByPostId is error.");
        }
    }
}

/**
 * ### 投稿を取得
 * - userIdで取得
 * - limit, offsetを指定して投稿を取得
 *     - limit: 取得する投稿の数
 *     - offset: 取得する投稿の開始位置
 *     - limit, offsetのいずれかがnullの場合はエラー
 */
export const getPostsModelByUserId = async (userId: Post["userId"], limit: number|string, offset: number|string) => {
    try {
        const query = "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
        const results = await executeQuery<RowDataPacket[]>(query, [userId, Number(limit), Number(offset)])

        return results as Post[]
    } catch (error) {
        if(error instanceof Error){
            throw new Error(`@getPostsByUserId is error: ${error.message}`);
        } else {
            throw new Error("@getPostsByUserId is error.");
        }
    }
}

/**
 * ### 投稿を取得
 * - accountNameで取得
 */
export const getPostsModelByAccountName = async (accountName: User["accountName"], limit: string|number, offset: string|number) => {
    try {
        const query = "SELECT p.* FROM posts p INNER JOIN users u ON p.user_id = u.user_id WHERE u.account_name = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
        const results = await executeQuery<RowDataPacket[]>(query, [accountName, Number(limit), Number(offset)])

        return results as Post[]
    } catch (error) {
        if(error instanceof Error){
            throw new Error(`@getPostsByAccountName is error: ${error.message}`);
        } else {
            throw new Error("@getPostsByAccountName is error.");
        }
    }
}

/**
 * ### 投稿を取得
 * - userNameで取得
 */
export const getPostsModelByUserName = async (userName: User["name"], limit: string|number, offset: string|number) => {
    try {
        const query = "SELECT p.* FROM posts p INNER JOIN users u ON p.user_id = u.user_id WHERE u.name = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
        const results = await executeQuery<RowDataPacket[]>(query, [userName, Number(limit), Number(offset)])

        return results as Post[]
    } catch (error) {
        if(error instanceof Error){
            throw new Error(`@getPostsByUserName is error: ${error.message}`);
        } else {
            throw new Error("@getPostsByUserName is error.");
        }
    }
}

/**
 * ### 投稿を取得
 * - limit, offsetを指定して投稿を取得
 *     - limit: 取得する投稿の数
 *     - offset: 取得する投稿の開始位置
 *     - limit, offsetのいずれかがnullの場合はエラー
 * - 投稿は作成日時の降順で取得
 */
export const getPostsModel = async (limit: number|string, offset: number|string) => {
    try {
        const query = "SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?"
        const results = await executeQuery<RowDataPacket[]>(query, [Number(limit), Number(offset)])

        return results as Post[]
    } catch (error) {
        if(error instanceof Error){
            throw new Error(`@getPostsModel is error: ${error.message}`);
        } else {
            throw new Error("@getPostsModel is error.");
        }
    }
}

/**
 * ### 投稿を作成
 * - postsテーブルとuser_postsテーブルの両方に保存
 * - トランザクション処理
 * - titleとdescriptionは必須
 */
export const createPostModel = async ( userId: Post["userId"], title: Post["title"], description: Post["description"] ) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 投稿を挿入
        const postId = uuidv4(); // uuidを生成
        const insertPostQuery = "INSERT INTO posts (post_id, user_id, title, description) VALUES (?, ?, ?, ?)";
        await executeQuery<ResultSetHeader>(insertPostQuery, [postId, userId, title, description]);

        // 投稿を取得
        const selectPostQuery = "SELECT * FROM posts WHERE id = ?";
        const posts = await executeQuery<RowDataPacket[]>(selectPostQuery, [postId]);
        throwErrorIfFalsy(posts.length, "@createPostModel: Failed to create post.");

        await connection.commit();
        return posts[0] as Post;
    } catch (error) {
        await connection.rollback();

        if(error instanceof Error){
            throw new Error(`@createPostModel is error: ${error.message}`);
        } else {
            throw new Error("@createPostModel is error.");
        }
    } finally {
        connection.release(); // 必ず接続を解放
    }
}

/**
 * ### 投稿を更新
 * - post_idで更新
 * - title, descriptionがnullの場合は更新しない
 */
export const updatePostModel = async (postId: Post["postId"], title: Post["title"], description: Post["description"]) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        let query = "UPDATE posts SET updated_at = NOW()"
        const params: string[] = []
        if(title !== null){
            query += ", title = ?"
            params.push(title)
        }
        if(description !== null){
            query += ", description = ?"
            params.push(description)
        }
        query += " WHERE post_id = ?"

        const results = await executeQuery<ResultSetHeader>(query, [...params, postId])
        throwErrorIfFalsy(results.affectedRows, "@updatePostModel: Post not found")

        const post = await getPostModelByPostId(postId)

        await connection.commit();
        return post
    } catch (error) {
        await connection.rollback();

        if(error instanceof Error){
            throw new Error(`@updatePostModel is error: ${error.message}`);
        } else {
            throw new Error("@updatePostModel is error.");
        }
    } finally {
        connection.release(); // 必ず接続を解放
    }
}

/**
 * ### 投稿を削除
 * - post_idで削除
 */
export const deletePostModelByPostId = async (postId: Post["postId"]) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const query = "UPDATE posts SET deleted_at = NOW() WHERE post_id = ?"
        const results = await executeQuery<ResultSetHeader>(query, [postId])
        throwErrorIfFalsy(results.affectedRows, "@deletePostModel: Post not found")

        await connection.commit();
        return true
    } catch (error) {
        await connection.rollback();

        if(error instanceof Error){
            throw new Error(`@deletePostModel is error: ${error.message}`);
        } else {
            throw new Error("@deletePostModel is error.");
        }
    } finally {
        connection.release(); // 必ず接続を解放
    }
}
