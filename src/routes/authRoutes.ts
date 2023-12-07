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
    res.redirect("/") // 認証成功
  }
)

export default router
