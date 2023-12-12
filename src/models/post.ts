import { Post } from "@prisma/client";
import { pool, prisma } from "../utils/db";
import { RowDataPacket } from "mysql2";

/**
 * ### 自分自身の投稿かどうかのチェック
 */
export const isPostOwnedByUser = async (postId?: Post["postId"], userId?: Post["userId"]) => {

    if(!postId){
        throw new Error("postId is null")
    }

    if(!userId){
        throw new Error("userId is null")
    }

    const query = "SELECT 1 FROM posts WHERE post_id = ? AND user_id = ? LIMIT 1"
    const [results] = await pool.execute<RowDataPacket[]>(query, [postId, userId])
    const isMyPost = results.length > 0

    if(!isMyPost){
        throw new Error("This is not my post")
    }

    return isMyPost
}
