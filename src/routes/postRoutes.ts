
import express from 'express'
import { isAuthenticated } from '../models/user'
import { createPost, getPosts, getPostsByUserId, getPostByPostId, deletePostByPostId, updatePostByPostId, getPostsByUserName, getPostsByAccountName } from '../controllers/postController'

const router = express.Router()

// 投稿を作成
// POST http://localhost:3000/api/post/create
router.post('/post/create', isAuthenticated, async (req, res) => {
    const { title, description } = req.body
    const userId = req.session.id

    try {
        const post = await createPost(title, description, userId)
        res.status(200).json({ success: true, post })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({ success: false, message: error.message })
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error })
        }
    }
})

// 投稿を取得
// GET http://localhost:3000/api/post/get
router.get('/post/get', async (req, res) => {
        const { limit, offset } = req.body

        try {
            const posts = await getPosts(limit, offset)
            res.status(200).json({ success: true, posts })
        } catch (error) {
            if(error instanceof Error){
                res.status(400).json({ success: false, message: error.message })
            } else {
                res.status(500).json({ success: false, message: "Internal Server Error", error })
            }
        }
})

// 投稿を取得
// GET http://localhost:3000/api/post/getbyuserid?userid=xxx
//  - userIdをもとに投稿を取得
router.get('/post/getbyuserid', async (req, res) => {
    try {
        const { limit, offset } = req.body
        const userId = typeof req.query.userid === 'string' ? req.query.userid : undefined
        if(userId === undefined) throw new Error("userId is undefined")

        const posts = await getPostsByUserId(userId, limit, offset)
        res.status(200).json({ success: true, posts })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({ success: false, message: error.message })
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error })
        }
    }
})

// 投稿を取得
// GET http://localhost:3000/api/post/getbyusername?username=xxx
//  - userNameをもとに投稿を取得
router.get('/post/getbyusername', async (req, res) => {
    try {
        const { limit, offset } = req.body
        const userName = typeof req.query.userName === 'string' ? req.query.userName : undefined
        if(userName === undefined) throw new Error("userName is undefined")

        const posts = await getPostsByUserName(userName, limit, offset)
        res.status(200).json({ success: true, posts })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({ success: false, message: error.message })
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error })
        }
    }
})

// 投稿を取得
// GET http://localhost:3000/api/post/getbyaccountname?accountname=xxx
//  - accountNameをもとに投稿を取得
router.get('/post/getbyaccountname', async (req, res) => {
    try {
        const { limit, offset } = req.body
        const accountName = typeof req.query.accountName === 'string' ? req.query.accountName : undefined
        if(accountName === undefined) throw new Error("accountName is undefined")

        const posts = await getPostsByAccountName(accountName, limit, offset)
        res.status(200).json({ success: true, posts })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({ success: false, message: error.message })
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error })
        }
    }
})

// 投稿を取得
// GET http://localhost:3000/api/post/getbypostid?postid=xxx
//  - postIdを元に投稿を取得
router.get('/post/getbypostid', isAuthenticated, async (req, res) => {
    try {
        const postId = typeof req.query.postid === 'string' ? req.query.postid : undefined
        if(postId === undefined) throw new Error("postId is undefined")

        const post = await getPostByPostId(postId)
        res.status(200).json({ success: true, post })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({ success: false, message: error.message })
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error })
        }
    }
})

// 投稿を削除
// DELETE http://localhost:3000/api/post/deletebypostid?postid=xxx
// 自分自身の投稿のみ削除可能
router.delete('/post/deletebypostid', isAuthenticated, async (req, res) => {
    try {
        const postId = typeof req.query.postid === 'string' ? req.query.postid : undefined
        const userId = req.session.id
        if(postId === undefined) throw new Error("postId is undefined")

        const post = await deletePostByPostId(postId, userId)
        res.status(200).json({ success: true, post })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({ success: false, message: error.message })
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error })
        }
    }
})

// 投稿を更新
// PUT http://localhost:3000/api/post/updatebypostid?postid=xxx
// 自分自身の投稿のみ更新可能
router.put('/post/updatebypostid', isAuthenticated, async (req, res) => {
    try {
        const postId = typeof req.query.postid === 'string' ? req.query.postid : undefined
        const userId = req.session.id
        const { title, description } = req.body
        if(postId === undefined) throw new Error("postId is undefined")

        const post = await updatePostByPostId(postId, userId, title, description)
        res.status(200).json({ success: true, post })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({ success: false, message: error.message })
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error })
        }
    }
})

export default router
