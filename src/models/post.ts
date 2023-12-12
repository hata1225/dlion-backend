import { Post } from "@prisma/client";
import { prisma } from "../utils/db";

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

    const isMyPost = await prisma.post.findUnique({
        where: { postId, userId }
    })

    if(!isMyPost){
        throw new Error("This is not my post")
    }

    return isMyPost
}
