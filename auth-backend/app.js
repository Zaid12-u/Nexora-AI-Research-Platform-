import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import historyRoutes from './routes/history.routes.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://nexora-ai-research-platform.vercel.app"
    ],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/history", historyRoutes)

export default app