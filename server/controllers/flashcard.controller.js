import asyncHandler from "express-async-handler"
import fs from "fs/promises"
import path from "path"
import { createError } from "../utils/createError.js"
import { Flashcard } from "../models/flashcard.model.js"
import { aiGenerateFlashcard } from "../utils/geminiService.js"
import { Activity } from "../models/Activity.model.js"
import { Document } from "../models/document.model.js"

// Get A Flashcard
const getFlashcard = asyncHandler(async(req, res) => {
    const flashcard = await Flashcard.findOne({
        _id: req.params.id,
        user_id: req.user.id
    })

    if (!flashcard) {
        throw createError("Flashcard not found", 404)
    }
    
    res.status(200).json({
        message: "flashcard fetched successfully",
        flashcard: flashcard
    })
})

// Get All Document Flashcard
const getDocumentFlashcards = asyncHandler(async(req, res) => {
    const flashcards = await Flashcard.find({
        doc_id: req.params.id,
        user_id: req.user.id
    })
    
    res.status(200).json({
        message: "flashcards fetched successfully",
        flashcards: flashcards
    })
})

// Get All User Flashcard
const getUserFlashcards = asyncHandler(async(req, res) => {
    const flashcards = await Flashcard.find({user_id: req.user.id}).populate("doc_id", "doc_name")
    
    res.status(200).json({
        message: "flashcards fetched successfully",
        flashcards: flashcards
    })
})

// Create 
const createFlashcard = asyncHandler(async(req, res) => {
    const doc_id = req.params.id
    const generatedFlashcard = await aiGenerateFlashcard(doc_id) 

    const cleanedRes = generatedFlashcard.replace(/```json/g, "").replace(/```/g, "").trim()

    const newFlashcard = await Flashcard.create({
        user_id: req.user.id,
        doc_id: doc_id,
        questions: JSON.parse(cleanedRes)
    })

    const doc = await Document.findOne({_id: doc_id, user_id: req.user.id})
    // Store Activity
    await Activity.create({
        user_id: req.user.id,
        type: "flashcard",
        action: "generated",
        doc_id:  doc_id,
        doc_name: doc.doc_name
    })

    res.status(201).json({
        success: true,
        message: "Flashcard created successfully",
        flashcard: newFlashcard
    })
})


// Update
const updateFlashcard = asyncHandler(async(req, res) => {
    const {flashcard_id, question_id} = req.params

    const changed = req.body 

    // Get Flashcard
    const flashcard = await Flashcard.findOne({_id: flashcard_id, user_id: req.user.id})
    if (!flashcard) {
        throw createError("Flashcard not found", 404)
    }
    
    // Update Question
    const question = flashcard.questions.id(question_id)
    if (!question) {
        throw createError("Question not found", 404)
    }

    Object.assign(question, changed)
    await flashcard.save()

    res.status(200).json({
        message: "Flashcard updated successfully",
        flashcard: flashcard
    })
})


// Delete
const deleteFlashcard = asyncHandler(async(req, res) => {
    const flashcard = await Flashcard.findOneAndDelete({
        _id: req.params.id,
        user_id: req.user.id
    })

    if (!flashcard) {
        throw createError("Flashcard not found", 404)
    }

    const doc = await Document.findOne({_id: flashcard.doc_id, user_id: req.user.id})
    // Store Activity
    await Activity.create({
        user_id: req.user.id,
        type: "flashcard",
        action: "deleted",
        doc_id:  flashcard.doc_id,
        doc_name: doc.doc_name
    })

    res.status(200).json({
        success: true,
        message: "Flashcard deleted successfull"
    })
})

export {getFlashcard, getDocumentFlashcards, getUserFlashcards, createFlashcard, updateFlashcard,  deleteFlashcard}