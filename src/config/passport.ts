import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { createUser } from "controllers/userController"
import { prisma } from "utils/db"

// Passportの設定
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "", // Google Cloud Platformで取得したクライアントID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "", // Google Cloud Platformで取得したクライアントシークレット
      callbackURL: "http://localhost:3000/auth/google/callback" ?? "", // Googleからの認証応答を受け取るURL
    },
    // Googleからの認証応答を受け取った後の処理
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id
        const email = profile.emails?.[0].value ?? ""
        const name = profile.displayName

        // データベースでユーザーを検索（または新しいユーザーを作成）
        let user = await prisma.user.findUnique({ where: { googleId } })
        if (!user) {
          user = await createUser(email, null, name, googleId)
        }

        done(null, user) // 認証成功
      } catch (error) {
        if (error instanceof Error) {
          done(error) // エラーをError型として扱う
        } else {
          done(new Error("Unknown error occurred")) // 未知のエラーの場合
        }
      }
    }
  )
)

// セッションにユーザーIDを保存
passport.serializeUser((user, done) => {
  done(null, user.id) // ユーザーIDを渡す
})

// セッションからユーザーIDを取り出す
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    done(null, user) // ユーザー情報を渡す
  } catch (error) {
    if (error instanceof Error) {
      done(error) // エラーをError型として扱う
    } else {
      done(new Error("Unknown error occurred")) // 未知のエラーの場合
    }
  }
})



export default passport