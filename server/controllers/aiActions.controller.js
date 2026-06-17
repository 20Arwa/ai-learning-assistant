import asyncHandler from "express-async-handler"
import fs from "fs/promises"
import path from "path"
import { createError } from "../utils/createError.js"

import {aiGenerateSummary, aiExplainConcept}  from "../utils/geminiService.js"


const generateSummary = asyncHandler(async(req, res) => {
    const Summary = await aiGenerateSummary(req.params.id)
    
    res.status(200).json({
        message: "Summary generated successfully",
        summary: Summary
    })
})

const explainConcept = asyncHandler(async(req, res) => {
    const concept = req.body.concept?.trim()
    
    // Concept Validation
    if (!concept) {
        throw createError("Concept is required", 400)
    }
    if (concept.length > 100) {
        throw createError("Concept must be less than 100 characters", 400)
    }

    const explanation = await aiExplainConcept(req.params.id, concept)

    res.status(200).json({
        message: "Explain concept generated successfully",
        explanation: explanation
    })
})

export {generateSummary, explainConcept}