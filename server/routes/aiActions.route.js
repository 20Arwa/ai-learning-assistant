import { Router } from "express";
import { generateSummary, explainConcept } from "../controllers/aiActions.controller.js";
import { validateToken } from "../middleware/validateToken.js";

const aiRouter = Router()

aiRouter.route("/generateSummary/:id").get(validateToken, generateSummary)
aiRouter.route("/explainConcept/:id").post(validateToken, explainConcept)

export default aiRouter