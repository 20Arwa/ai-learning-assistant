import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import fs from "fs/promises"
import path from "path"
import { createError } from "../utils/createError.js"
import {User} from "../models/user.model.js"
import { validationResult } from "express-validator"

const generateToken = (id) => jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"})

// Register
const register = asyncHandler(async(req, res, next) => {
    const {user_name, email, password, profile_image} = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const user = await User.create({
        user_name,
        email: email.toLowerCase(),
        password,
        profile_image
    })

    const token  = generateToken(user.id)

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 23 * 60 * 60 * 1000
    })

    res.status(201).json({
        success: true,
        message: "Account is created successfully",
        user: {id: user.id, user_name: user.user_name, email: user.email},
    })
})

// Login
const login = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const user = await User.findOne({email}).select("+password")
    
    if (!user) {
        throw createError("USER_NOT_FOUND", 404)
    }
    
    const isMatch = await user.comparePassword(password)
    
    if (!isMatch) {
        throw createError("Incorrect password",401)
    }
    
    const token  = generateToken(user.id)

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 23 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Logged in successfully",
        user: {id: user.id, user_name: user.user_name, email: user.email}, 
    })
})

// Log out
const logout = asyncHandler(async(req, res, next) => {
    res.clearCookie("token")
    res.status(200).json({message: "Logged out"})
})

// Get Profile
const getProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id)

    if (!user) 
        throw createError("USER_NOT_FOUND", 404)

    res.json(user)
})

// Update Prdofile
const updateProfile = asyncHandler(async(req, res, next) => {
    const {user_name, email} = req.body

    if (!user_name && !email) {
        throw createError("Nothing to update", 400)
    }

    // Select Updated Data
    let updateData = {}
    if (user_name) updateData.user_name = user_name
    if (email) updateData.email = email
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { returnDocument: "after" })
    
    res.json(updatedUser)
})

// Change Profile Image
const changeProfileImg = asyncHandler(async (req, res) => {
    const user_id = req.user.id

    if (!req.file) {
        throw createError("No File Uploaded", 400)
    }

    const user = await User.findById(user_id)
    if (!user) {
        throw createError("User not found", 404)
    }

    // Delete old profile image
    if (user.profile_img !== "/uploads/profile_imgs/profile-default.png") {
        const old_path = path.join(process.cwd(),user.profile_img)
        await fs.unlink(old_path)
    }

    const profile_url = `/uploads/profile_imgs/${req.file.filename}`

    user.profile_img = profile_url

    await user.save()

    res.status(200).json({
        message: "Profile image updated",
        profile_url
    })
})

// Change Password
const changePassword = asyncHandler(async(req, res, next) => {
    const {current_password, new_password} = req.body

    if (!current_password || !new_password) {
        throw createError("All fields are required", 400)
    }
    const user = await User.findById(req.user.id).select("+password")
    
    const isMatch = await user.comparePassword(current_password)

    if (!isMatch) {
        throw createError("INVALID_PASSWORD", 401)
    }

    user.password = new_password
    await user.save()

    res.json({message: "Password updated successfully"})
})

export {register, login, logout, getProfile, updateProfile, changeProfileImg,  changePassword}