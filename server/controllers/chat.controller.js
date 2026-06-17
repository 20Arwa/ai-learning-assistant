import asyncHandler from "express-async-handler"
import fs from "fs/promises"
import path from "path"
import { createError } from "../utils/createError.js"
import {aiChat}  from "../utils/geminiService.js"
import { Chat } from "../models/chat.model.js"
import { Message } from "../models/message.model.js"
import { exit } from "process"


const getMessages = asyncHandler(async(req, res) => {
    const chat = await Chat.findOne({
        doc_id: req.params.id,
        user_id: req.user.id
    })

    if (!chat) {
        res.status(200).json({
            exists: false,
        })
    }
    
    else {
        const messages = await Message.find({chat_id: chat._id}).sort({ createdAt: 1 })
        res.status(200).json({
            exists: true,
            messages: messages
        })
    }
})

const chat = asyncHandler(async(req, res) => {
    const user_ques = req.body.user_ques

    if (!user_ques) 
        throw createError("User msg is required", 400)

    // Check if chat exist, create if not
    let chat = await Chat.findOne({user_id: req.user.id, doc_id: req.params.id})
    if (!chat) {
        chat = await Chat.create({
            user_id: req.user.id,
            doc_id: req.params.id
        })
    }

    // create message model for user msg
    await Message.create({
        chat_id: chat._id,
        role: "user",
        content: user_ques
    })
    
    const response = await aiChat(req.params.id, chat._id, user_ques)
    
    // create message model for ai response
    await Message.create({
        chat_id: chat._id,
        role: "assistant",
        content: response
    })
    
    res.status(200).json({
        message: "Response generated successfully",
        response: response
    })
})

export {chat, getMessages}