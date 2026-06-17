import asyncHandler from "express-async-handler"
import { createError } from "../utils/createError.js"
import { Document } from "../models/document.model.js"
import { Flashcard } from "../models/flashcard.model.js"
import { Quiz } from "../models/quiz.model.js"
import { error } from "console"
import { Activity } from "../models/activity.model.js"


const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const totalDocs = await Document.countDocuments({ user_id: userId })
    const totalFlashcards = await Flashcard.countDocuments({ user_id: userId })
    const totalQuizzes = await Quiz.countDocuments({ user_id: userId })

    res.json({
        "Total Documents": totalDocs,
        "Total Flashcards": totalFlashcards,
        "Total Quizzes": totalQuizzes
    })
})

const getRecentActivities = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const recentActivities = await Activity.find({ user_id: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("doc_id", "doc_name");
    
    res.json(recentActivities)
})

export { getDashboardStats, getRecentActivities }