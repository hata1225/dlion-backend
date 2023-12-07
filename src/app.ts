import express from "express"
import todoRoutes from "routes/todoRoutes"
import authRoutes from "routes/authRoutes"
import dotenv from "dotenv"

dotenv.config()
const app = express()
app.use(express.json())
app.use("/todos", todoRoutes)
app.use("",authRoutes)

export default app
