import { Router } from "express";
import { createQuiz, getQuiz, getDocumentQuizzes, updateQuiz, retakeQuiz, deleteQuiz } from "../controllers/quiz.controller.js";
import { validateToken } from "../middleware/validateToken.js";

const quizRouter = Router()

quizRouter.route("/document/:id")
    .get(validateToken, getDocumentQuizzes)
    .post(validateToken, createQuiz)

quizRouter.route("/:id")
    .get(validateToken, getQuiz)
    .patch(validateToken,updateQuiz)
    .delete(validateToken,deleteQuiz)
    
quizRouter.route("/:id/retake").patch(validateToken,retakeQuiz)

export default quizRouter