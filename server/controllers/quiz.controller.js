import asyncHandler from "express-async-handler"
import fs from "fs/promises"
import path from "path"
import { createError } from "../utils/createError.js"
import { Quiz } from "../models/Quiz.model.js"
import { aiGenerateQuiz } from "../utils/geminiService.js"
import { Activity } from "../models/Activity.model.js"
import { Document } from "../models/document.model.js"

// Get A Quiz
const getQuiz = asyncHandler(async(req, res) => {
    const quiz = await Quiz.findOne({
        _id: req.params.id,
        user_id: req.user.id
    }).populate("doc_id", "doc_name")
    
    if (!quiz) {
        throw createError("Quiz not found", 404)
    }
    
    res.status(200).json({
        message: "Quiz fetched successfully",
        quiz: quiz
    })
})

// Get All Document Quizzes
const getDocumentQuizzes = asyncHandler(async(req, res) => {
    const quizzes = await Quiz.find({
        doc_id: req.params.id,
        user_id: req.user.id
    }).populate("doc_id", "doc_name")
    
    res.status(200).json({
        message: "Quizzes fetched successfully",
        quizzes: quizzes
    })
})

// Create 
const createQuiz = asyncHandler(async(req, res) => {
    const {questions_num} = req.body
    if (!questions_num) {
        throw createError("Question numbers is required", 400)
    }
    const generatedQuiz = await aiGenerateQuiz(req.params.id, questions_num)

    const cleanedRes = generatedQuiz.replace(/```json/g, "").replace(/```/g, "").trim()

    const newQuiz = await Quiz.create({
        user_id: req.user.id,
        doc_id: req.params.id,
        questions: JSON.parse(cleanedRes)
    })

    await newQuiz.populate("doc_id", "doc_name") 
    await newQuiz.save()

    // Store Activity
    await Activity.create({
        user_id: req.user.id,
        type: "quiz",
        action: "generated",
        doc_id:  req.params.id,
        doc_name: newQuiz.doc_id.doc_name
    })

    res.status(201).json({
        success: true,
        message: "Quiz created successfully",
        quiz: newQuiz
    })
})

// Update
const updateQuiz = asyncHandler(async(req, res) => {
    const {id} = req.params

    const {questions, score} = req.body 

    // Get Quiz
    const quiz = await Quiz.findOneAndUpdate({_id: id, user_id: req.user.id }, {questions, score}, { returnDocument: "after" })  
    
    const doc = await Document.findOne({_id: quiz.doc_id, user_id: req.user.id})
    // Store Activity
    await Activity.create({
        user_id: req.user.id,
        type: "quiz",
        action: "solved",
        doc_id:  quiz.doc_id,
        doc_name: doc.doc_name
    })
    
    res.status(200).json({
        message: "Quiz updated successfully",
        quiz: quiz
    })
})

// Retake
const retakeQuiz = asyncHandler(async(req, res) => {
    const {id} = req.params

    // Get Quiz
    const quiz = await Quiz.findOneAndUpdate(
        {_id: id, user_id: req.user.id },
        {
            $unset: {
            score: "",
            "questions.$[].selected_index": "",
            },
        },
        { returnDocument: "after" }
    )  
    if (!quiz) {
        throw createError("Quiz not found", 404)
    }
    
    res.status(200).json({
        message: "Quiz updated successfully",
        quiz: quiz
    })
})

// Delete
const deleteQuiz = asyncHandler(async(req, res) => {
    const quiz = await Quiz.findOneAndDelete({
        _id: req.params.id,
        user_id: req.user.id
    })

    if (!quiz) {
        throw createError("Quiz not found", 404)
    }

    const doc = await Document.findOne({_id: quiz.doc_id, user_id: req.user.id})
    // Store Activity
    await Activity.create({
        user_id: req.user.id,
        type: "quiz",
        action: "deleted",
        doc_id:  quiz.doc_id,
        doc_name: doc.doc_name
    })

    res.status(200).json({
        success: true,
        message: "Quiz deleted successfull"
    })
})

export {createQuiz, getQuiz, getDocumentQuizzes, updateQuiz, retakeQuiz, deleteQuiz}