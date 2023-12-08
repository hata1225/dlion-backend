import express from "express"
import passport from "passport"

const router = express.Router()

// Google認証のためのルーティング
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
)

// Google認証のコールバック
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // 認証失敗
    session: false // セッションを使わない
  }),
  (req, res) => {
    const userId = req.user?.id
    if(userId){
      req.session.id = userId
      res.redirect("/") // 認証成功時はトップページにリダイレクト
    } else {
      res.redirect("/login") // 認証失敗時はログインページにリダイレクト
    }
  }
)

export default router
