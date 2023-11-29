import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // 認証成功時の処理
    // ユーザー情報をセッションに保存
    req.session.user = req.user;
    res.redirect("/");
  }
);

export default router;
