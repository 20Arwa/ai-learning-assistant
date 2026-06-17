import asyncHandler from "express-async-handler"
import fs from "fs/promises"
import path from "path"
import { createError } from "../utils/createError.js"
import { Document } from "../models/document.model.js"
import mongoose from "mongoose"
import { Quiz } from "../models/quiz.model.js"
import { Flashcard } from "../models/flashcard.model.js"
import { Chat } from "../models/chat.model.js"
import parsePDF from "../utils/pdfParser.js"
import textChunker from "../utils/textChunker.js"
import createEmbedding from "../utils/embedding.js"
import { DocumentChunk } from "../models/documentChunk.model.js"
import { Message } from "../models/message.model.js"
import { Activity } from "../models/Activity.model.js"


const getADoc = asyncHandler(async(req, res) => {
    const doc = await Document.findOne({_id: req.params.id, user_id: req.user.id})

    if (!doc) {
        throw createError("Document not found", 404)
    }

    res.status(200).json({
        message: "Document fetched successfully",
        doc: doc,
    })
})

const getAllDocs = asyncHandler(async(req, res) => {
    // Get Documents With Num Of Quizzes And Flashcards
    const allDoc = await Document.aggregate([
    {
        $match: {
        user_id: new mongoose.Types.ObjectId(req.user.id)
        }
    },

    {
        $lookup: {
        from: "quizzes",
        localField: "_id",
        foreignField: "doc_id",
        as: "quizzes"
        }
    },

    {
        $lookup: {
        from: "flashcards",
        localField: "_id",
        foreignField: "doc_id",
        as: "flashcards"
        }
    },

    {
        $addFields: {
        quizzesCount: { $size: "$quizzes" },
        flashcardsCount: { $size: "$flashcards" }
        }
    },

    {
        $project: {
        quizzes: 0,
        flashcards: 0
        }
    }
    ])

    res.status(200).json({
        message: "Documents fetched successfully",
        docs: allDoc
    })
})

const uploadDoc = asyncHandler(async(req, res) => {
    const file = req.file

    if (!file) {
        throw createError("Document not found", 404)
    }

    const url_path = `uploads/documents/${file.filename}`

    const newDoc = await Document.create({
        user_id: req.user.id,
        doc_name: req.body.docTitle,
        url_path: url_path,
        size: file.size
    })

    // Store Activity
    await Activity.create({
        user_id: req.user.id,
        type: "document",
        action: "uploaded",
        doc_id: newDoc._id,
        doc_name: newDoc.doc_name
    })

    // Chunk Document
    const pdfText = await parsePDF(url_path)
    const textChunks = await textChunker(pdfText)
    newDoc.chunks = textChunks
    await newDoc.save()

    // Embedding Document
    if (process.env.GEMINI_API_KEY)
        await createEmbedding(textChunks, newDoc._id)     

    res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        data: newDoc
    })
})

const updateTitle = asyncHandler(async(req, res) => {
    const newTitle = req.body.newTitle
    
    if (!newTitle) {
        throw createError("Title is required", 400)
    }
    else if (newTitle.length < 3) {
        throw createError("Title must be at least 3 characters", 401)
    }

    const doc = await Document.findOneAndUpdate({_id: req.params.id, user_id: req.user.id }, { doc_name: newTitle }, { returnDocument: "after" })

    if (!doc) {
        throw createError("Document not found", 404)
    }

    // Store Activity
    await Activity.create({
        user_id: req.user.id,
        type: "document",
        action: "updated",
        doc_id:  req.params.id,
        doc_name: newTitle
    })
    
    res.status(200).json({
        message: "Title updated successfully",
        doc: doc
    })
})


const deleteDoc = asyncHandler(async(req, res) => {
    const doc_id = req.params.id
    const doc = await Document.findOne({_id: doc_id, user_id: req.user.id})
    if (!doc) {
        throw createError("Document not found", 404)
    }
    
    // Delete Related Models
    await Flashcard.deleteMany({doc_id: doc_id})
    await Quiz.deleteMany({doc_id: doc_id})

    // Delete Chat
    const chats = await Chat.find({ doc_id: doc_id })
    const chatIds = chats.map(chat => chat._id)
    await Message.deleteMany({
        chat_id: { $in: chatIds }
    })
    await Chat.deleteMany({ doc_id: doc_id })
    
    // Delete Document
    await DocumentChunk.deleteMany({doc_id: doc_id})
    
    // Store Activity
    await Activity.create({
        user_id: req.user.id,
        type: "document",
        action: "deleted",
        doc_id: doc_id,
        doc_name: doc.doc_name
    })
    
    // Delete Doc From Database
    await doc.deleteOne()

    // Delete Doc From Uploads Folder
    const doc_path = path.join(process.cwd(), doc.url_path)

    await fs.unlink(doc_path)


    res.status(200).json({
        success: true,
        message: "Document deleted successfull"
    })
})

export {getAllDocs, getADoc, uploadDoc, updateTitle,  deleteDoc}