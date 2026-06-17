import { Router } from "express";
import {createFlashcard, getDocumentFlashcards, getUserFlashcards, getFlashcard, updateFlashcard, deleteFlashcard  } from "../controllers/flashcard.controller.js";
import { validateToken } from "../middleware/validateToken.js";

const flashcardRouter = Router()

flashcardRouter.route("/document/:id")
    .get(validateToken, getDocumentFlashcards)
    .post(validateToken, createFlashcard)

flashcardRouter.route("/")
    .get(validateToken, getUserFlashcards)

flashcardRouter.route("/:id")
    .get(validateToken, getFlashcard)
    .delete(validateToken,deleteFlashcard)
    
flashcardRouter.route("/:flashcard_id/questions/:question_id").patch(validateToken,updateFlashcard)

export default flashcardRouter