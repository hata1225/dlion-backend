import express from "express"
import authRoutes from "./routes/authRoutes"
import postRoutes from "./routes/postRoutes"
import dotenv from "dotenv"
import passport from "passport"
import session from "express-session"
import "./config/passport"

dotenv.config()
const app = express()
app.use(express.json())
app.use("/api", authRoutes)
app.use("/api", postRoutes)
app.use(
    session({
        secret: process.env.SESSION_SECRET ?? "secret", // セッションキー
        resave: false, // セッションに変更がなくてもセッションを保存する
        saveUninitialized: false, // 初期化されていないセッションを保存する
        cookie: {
            httpOnly: true, // クライアント側でクッキーを見れないようにする
            secure: false, // httpsで使用する場合はtrueにする
            maxAge: 1000 * 60 * 60 * 24 * 14, // 14日
        },
    }),
)

app.use(passport.initialize())
app.use(passport.session())

export default app
