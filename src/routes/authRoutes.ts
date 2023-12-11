import express from "express"
import passport from "passport"

const router = express.Router()


// Google認証のためのルーティング
// GET http://localhost:3000/api/auth/google/login
router.get(
  "/auth/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
)

// Google認証のコールバック
// GET http://localhost:3000/api/auth/google/callback
router.get(
  process.env.GOOGLE_CALLBACK_PATH ?? "",
  passport.authenticate("google", {
    failureRedirect: "/login", // 認証失敗時のリダイレクト先
    session: false // セッションを使わない
  }),
  (req, res) => {
    const userId = req.user?.id
    if(userId){
      req.session.id = userId
      res.redirect("/") // 認証成功
    } else {
      res.status(401).json({success: false, message: "Authentication failed"}) // 認証失敗
    }
  }
)

export default router
