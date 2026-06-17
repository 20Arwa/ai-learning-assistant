import { Router } from "express";
import { getAllDocs, getADoc, uploadDoc, updateTitle, deleteDoc } from "../controllers/document.controller.js";
import { validateToken } from "../middleware/validateToken.js";
import { uploadDocuments } from "../middleware/uploadDocuments.js";

const docRouter = Router()

docRouter.route("/")
    .get(validateToken, getAllDocs)
    .post(validateToken,uploadDocuments.single("uploadedDoc"), uploadDoc)

docRouter.route("/:id")
    .get(validateToken, getADoc)
    .patch(validateToken,updateTitle)
    .delete(validateToken,deleteDoc)

export default docRouter