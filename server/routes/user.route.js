import { Router } from "express";
import {body} from "express-validator"
import { validateToken } from "../middleware/validateToken.js";
import { register, login, logout, getProfile, updateProfile, changeProfileImg,  changePassword } from "../controllers/user.controller.js";
import { uploadProfile } from "../middleware/uploadProfile.js";

const userRoute = Router()

const registerValid = [
    body('user_name')
    .trim()
    .isLength({min: 3})
    .notEmpty()
    .withMessage("User name must be at least 3 characters"),

    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
    
    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters"),
]

const loginValid = [
    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
]

userRoute.route("/register").post(registerValid, register)
userRoute.route("/login").post(loginValid, login)
userRoute.route("/logout").post(logout)

userRoute.route("/getProfile").get(validateToken, getProfile)
userRoute.route("/updateProfile").patch(validateToken,updateProfile)
userRoute.route("/changeProfileImg").patch(validateToken, uploadProfile.single("profile_img"), changeProfileImg)
userRoute.route("/changePassword").patch(validateToken,changePassword)

export default userRoute