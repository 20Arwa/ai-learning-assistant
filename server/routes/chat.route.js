import { Router } from "express";
import { chat, getMessages} from "../controllers/chat.controller.js";
import { validateToken } from "../middleware/validateToken.js";

const chatRouter = Router()

chatRouter.route("/document/:id").post(validateToken, chat)

chatRouter.route("/document/:id").get(validateToken, getMessages)

export default chatRouter