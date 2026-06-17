import dotenv from "dotenv"
dotenv.config()

import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./config/database.js"

import userRouter from "./routes/user.route.js";
import dashboardRouter from "./routes/dashboard.route.js"
import docRouter from "./routes/document.route.js";
import flashcardRouter from "./routes/flashcard.route.js";
import quizRouter from "./routes/quiz.route.js"
import aiRouter from "./routes/aiActions.route.js"
import chatRouter from "./routes/chat.route.js"

import cors from "cors"
import errorHandler from "./middleware/errorHandler.js"
import cookieParser from "cookie-parser"




const app = express()

connectDB()


app.use(cors( {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}
))

app.use(express.json())
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname,'uploads')))

// Routes
app.use("/api/auth", userRouter)
app.use("/api/dashboard", dashboardRouter)
app.use("/api/document", docRouter)
app.use("/api/flashcard", flashcardRouter)
app.use("/api/quiz", quizRouter)
app.use("/api/ai", aiRouter)
app.use("/api/chat", chatRouter)

app.use(errorHandler)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        statusCode: 404
    })
})



const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server Is Running On Port: ${port}`)
})

