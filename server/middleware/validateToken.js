import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import { createError } from "../utils/createError.js"

const validateToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token

    console.log("HEADERS:", req.headers.cookie)
    console.log("COOKIES:", req.cookies)

    if (!token) {
        res.status(401)
        throw new Error("No token provided")
    }

    try {
        const decode = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
        )

        req.user = decode
        next()
    } catch (err) {
        res.status(401)
        throw new Error("Invalid token")
    }
})

export {validateToken}