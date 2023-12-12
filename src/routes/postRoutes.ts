
import express from 'express'
import { isAuthenticated } from '../models/user'
import { createPost, getPosts, getPostsByUser, getPostByPostId, deletePostByPostId, updatePostByPostId } from '../controllers/postController'

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
//  - userId, userName, userAccountNameいずれかを元に投稿を取得
// GET http://localhost:3000/api/post/getbyuser?userid=xxx
// GET http://localhost:3000/api/post/getbyuser?username=xxx
// GET http://localhost:3000/api/post/getbyuser?useraccountname=xxx
router.get('/post/getbyuser', isAuthenticated, async (req, res) => {
    const { limit, offset } = req.body
    const userId = typeof req.query.userid === 'string' ? req.query.userid : undefined;
    const userName = typeof req.query.username === 'string' ? req.query.username : undefined;
    const userAccountName = typeof req.query.useraccountname === 'string' ? req.query.useraccountname : undefined;

    try {
        const posts = await getPostsByUser(userId, userName, userAccountName, limit, offset)
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
//  - postIdを元に投稿を取得
// GET http://localhost:3000/api/post/getbypostid?postid=xxx
router.get('/post/getbypostid', isAuthenticated, async (req, res) => {
    const postId = typeof req.query.postid === 'string' ? req.query.postid : undefined;

    try {
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
    const postId = typeof req.query.postid === 'string' ? req.query.postid : undefined;
    const userId = req.session.id

    try {
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
    const postId = typeof req.query.postid === 'string' ? req.query.postid : undefined;
    const userId = req.session.id
    const { title, description } = req.body

    try {
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
