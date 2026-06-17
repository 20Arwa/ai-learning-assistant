import multer from "multer"
import path from "path"
import fs from "fs"

const uploadPath = path.join(process.cwd(), "uploads/documents")

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath)
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)

        cb(null, Date.now() + ext)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true)
    }
    else {
        cd(new Error("Only PDF files are allowed"))
    }
    
}
export const uploadDocuments = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter
})