import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import { createError } from "../utils/createError.js"

const validateToken = asyncHandler(async(req, res, next) => {
    const token = req.cookies.token

console.log("TOKEN:", token)

try {
    const decode = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    )

    console.log("DECODE:", decode)

    req.user = decode
    next()
} catch (err) {
    console.log("VERIFY ERROR:", err.message)
    throw err
}
})


export {validateToken}