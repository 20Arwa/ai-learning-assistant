import dotenv from "dotenv"
dotenv.config()

import { GoogleGenAI } from "@google/genai";
import { DocumentChunk } from "../models/DocumentChunk.model.js"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const createEmbedding = async (chunks, doc_id) => {
    await Promise.all(
        chunks.map(async (chunk, index) => {
            const response = await ai.models.embedContent({
                model: "gemini-embedding-001",
                contents: chunk
            });
            const embedding = response.embeddings[0].values
            
            const newDocChunk = await DocumentChunk.create({
                doc_id: doc_id,
                chunk_index: index,
                text: chunk,
                embedding: embedding
            })
        })
    )
}
export default createEmbedding