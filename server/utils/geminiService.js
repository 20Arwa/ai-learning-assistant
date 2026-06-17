import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleGenAI } from "@google/genai";
import parsePDF from "./pdfParser.js"
import textChunker from "./textChunker.js"
import createEmbedding from "./embedding.js"
import { Document } from "../models/document.model.js"
import { createError } from "./createError.js"
import { DocumentChunk } from "../models/documentChunk.model.js"
import { Message } from "../models/message.model.js";

// Ai
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAi.getGenerativeModel( {
    model: "gemini-2.5-flash-lite"
    
})
const embeddingAi = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Repeated Instructions
const repeatedInstructions = `
Format the response using proper Markdown:
- Use headings
- Use bullet points
- Add spacing between sections
`

// If Api Is Not Available
const ensureAIEnabled = () => {
    if (!process.env.GEMINI_API_KEY) 
        throw createError("AI features are disabled in this demo", 503)
}

// Summary
export const aiGenerateSummary = async (doc_id) => {
    // If AI Not Available
    ensureAIEnabled()

    // Get Document Chunks
    const doc = await Document.findById(doc_id)
    if (!doc) {
        throw createError("Document not found", 404)
    }
    const chunks = doc.chunks

    const fullText = chunks.join("\n") // Convert Array To Text

    let finalSummary = ""

    // If Text Too Large
    if (fullText.length > 20000) {
        const summaries  = []
        
        for (const chunk of chunks) {
            const prompt = `Provide a concise summary of the following document, highlighting the key concepts, main ideas, and important points.
            Keep the summary clear and structured. 
            ${repeatedInstructions}
            Document: 
            ${chunk}`
            
            try {
                const result = await model.generateContent(prompt)
                summaries .push(result.response.text())
            } catch {
                throw createError("Failed to generate summary", 500)
            }
        }

        // Combine Summaries
        const combinePrompt = `Provide a concise summary of the following partial summaries, highlighting the key concepts, main ideas, important points, and conclusions if available.
        Keep the summary clear and well-structured.
        ${repeatedInstructions}
        Partial Summaries:
        ${summaries.join("\n")}`

        try {
            const finalResult = await model.generateContent(combinePrompt)
            finalSummary = finalResult.response.text()
        } catch {
            throw createError("Failed to generate summary", 500)
        }
    }
    else {
        const prompt = `Provide a concise summary of the following document, highlighting the key concepts, main ideas, and important points.
        Keep the summary clear and structured. 
        ${repeatedInstructions}
        Document: 
        ${fullText}`
        
        try {
            const result = await model.generateContent(prompt)
            finalSummary = result.response.text()
        } catch {
            throw createError("Failed to generate summary", 500)
        }
    }
    return finalSummary
}

// Explain Concept
export const aiExplainConcept = async (doc_id, concept) => {
    // If AI Not Available
    ensureAIEnabled()

    // Embedding Concept
    const response = await embeddingAi.models.embedContent({
        model: "gemini-embedding-001",
        contents: concept
    })

    const conceptEmbedding = response.embeddings[0].values

    // Search Vector
    const results = await DocumentChunk.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: conceptEmbedding,
                numCandidates: 100,
                limit: 5,
                filter: {
                    doc_id: new mongoose.Types.ObjectId(doc_id)
                }
            }
        }
    ])
    
    if (!results.length) {
        return "The document does not contain enough information to explain this concept."
    }
    
    const context = results
    .map(chunk => chunk.text)
    .join("\n")
    
    if (!context.trim()) {
        return "The document does not contain enough information to explain this concept."
    }
        
    const prompt =  `Explain "${concept}" using ONLY information from the document.
    Rules:
    - Do not use outside knowledge.
    - If the document does not contain enough information about the concept, reply with EXACTLY:
    
    The document does not contain enough information to explain this concept

    - In that case, do not add any other text.
    - Do not summarize the document.
    - Do not provide related information.
    
    If sufficient information exists:
    ${repeatedInstructions}
    Provide a clear and easy-to-understand explanation.
    
    Document:
    ${context}`
    
    try {
        const result = await model.generateContent(prompt)
        return result.response.text()
    } catch {
        throw createError("Failed to generate concept", 500)
    }
}

// Flashcard
export const aiGenerateFlashcard = async(doc_id) => {
    // If AI Not Available
    ensureAIEnabled()

    // Get Document Chunks
    const doc = await Document.findById(doc_id)
    if (!doc) {
        throw createError("Document not found", 404)
    }
    const chunks = doc.chunks

    const flashcardNum = 10

    if (chunks.join("\n").length > 20000) {
        let allFlashcards = []
        let flashcardsPerChunk  = Math.ceil(flashcardNum / chunks.length)
        
        for (const chunk of chunks) {
            const prompt = `Generate exactly ${flashcardsPerChunk} educational flashcards from the following document.
            Return ONLY valid JSON.
            Format:
            [
                {
                    "question": "...",
                    "answer": "...",
                    "difficulty": "easy | medium | hard"
                }
            ]
            Document: 
            ${chunk}
            `

            try {
                const result = await model.generateContent(prompt)
                allFlashcards.push(result.response.text())
            } catch {
                throw createError("Failed to generate flashcard", 500)
            }
        }
        
        const finalPrompt = `
        From the following flashcards:
        
        - Remove duplicates
        - Keep the most important concepts
        - Return ONLY the best 10 flashcards
        
        Flashcards:
        ${allFlashcards.join("\n")} `
        
        try {
            const result = await model.generateContent(finalPrompt)
            return result.response.text()
        } catch {
            throw createError("Failed to generate flashcard", 500)
        }
    }
    else {
        const prompt = `Generate exactly ${flashcardNum} educational flashcards from the following document.
        Return ONLY valid JSON.
        Format:
        [
            {
                "question": "...",
                "answer": "...",
                "difficulty": "easy | medium | hard"
            }
        ]
        Document: 
        ${chunks.join("\n")}
        `

        try {
            const result = await model.generateContent(prompt)
            return result.response.text()
        } catch {
            throw createError("Failed to generate flashcard", 500)
        }
    }
}

// Quiz
export const aiGenerateQuiz = async(doc_id, questions_num) => {
    // If AI Not Available
    ensureAIEnabled()

    // Get Document Chunks
    const doc = await Document.findById(doc_id)
    if (!doc) {
        throw createError("Document not found", 404)
    }
    const chunks = doc.chunks

    if (chunks.join("\n").length > 20000) {
        let allQuiz = []
        let quizesPerChunk  = Math.ceil(questions_num / chunks.length)
        
        for (const chunk of chunks) {
            const prompt = `Generate exactly ${quizesPerChunk} multiple choice questions from the following Document.
            Return ONLY valid JSON.
            Format:
            [
                {
                    "q": "...",
                    "o": ["Option 1","Option 2","Option 3","Option 4"],
                    "c": 0 // index of correct answer (0-3),
                    "e": "Brief explanation"
                }
            ]
            Document: 
            ${chunk}`

            try {
                const result = await model.generateContent(prompt)
                allQuiz.push(result.response.text())
            } catch {
                throw createError("Failed to generate quiz", 500)
            }
        }
        
        const finalPrompt = `
        From the following quizes:
        - Remove duplicates
        - Keep the most important concepts
        - Return ONLY the best ${questions_num} quizes
        
        Quizez:
        ${allQuiz.join("\n")} `
        
        try {
            const result = await model.generateContent(finalPrompt)
            return result.response.text()
        } catch {
            throw createError("Failed to generate quiz", 500)
        }
    }
    else {
        const prompt = `Generate exactly ${questions_num} multiple choice questions from the following document.
            Return ONLY valid JSON.
            Format:
            [
                {
                    "q": "...",
                    "o": ["Option 1","Option 2","Option 3","Option 4"],
                    "c": 0 // index of correct answer (0-3),
                    "e": "Brief explanation"
                }
            ]
            Document: 
            ${chunks.join("\n")}`

            try {
            const result = await model.generateContent(prompt)
            return result.response.text()
        } catch {
            throw createError("Failed to generate quiz", 500)
        }
    }
}

// Chat
export const aiChat = async(doc_id, chat_id, user_ques) => {
    // If AI Not Available
    ensureAIEnabled()
    
    // Embedding User Msg
    const response = await embeddingAi.models.embedContent({
        model: "gemini-embedding-001",
        contents: user_ques
    })
    
    const questionEmbedding = response.embeddings[0].values

    // Search Vector
    const results = await DocumentChunk.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: questionEmbedding,
                numCandidates: 100,
                limit: 5,
                filter: {
                    doc_id: new mongoose.Types.ObjectId(doc_id)
                }
            }
        }
    ])
    
    if (!results.length) {
        return "The document does not contain enough information to answer this question."
    }

    const context = results
    .map(chunk => chunk.text)
        .join("\n\n")

    if (!context.trim()) {
        return "The document does not contain enough information to answer this question."
    }
        
    // Previous Messages
    const messages = await Message.find({ chat_id })
    .sort({ createdAt: -1 })
    .skip(1)
    .limit(5)
    .lean()
    
    messages.reverse()

    const history = messages
    .map(msg => `${msg.role}: ${msg.content}`)
    .join("\n")


        
    // Send To AI
    const prompt = `
    You are a document-based assistant.

    Answer ONLY using the provided document context.

    If the answer cannot be found explicitly or inferred directly from the document context, respond exactly with:

    "The document does not contain enough information to answer this question."

    Do not use your general knowledge.
    Do not make assumptions.
    Do not answer from prior training data.

    Conversation History: 
    ${history} 

    Context: 
    ${context} 
    
    Question: 
    ${user_ques} 
    Answer:
    `
    try {
        const result = await model.generateContent(prompt)
        return result.response.text()
    } catch(err) {
        throw createError("Failed to generate response", 500)
    }
}



