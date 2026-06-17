import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import { createError } from "../utils/createError.js"

const validateToken = asyncHandler(async(req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        createError("No token provided", 401)
    }

    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decode
        next()

    } catch(err) {
        throw err
    }
})

export {validateToken}