import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        user_name: {
            type: String,
            required: [true, "User Name Is Required"],
            unique: true,
            trim: true,
            minlength: [3, "User name must be at least 3 characters"]
        },
        email: {
            type: String,
            required: [true, "Email Is Required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
        },
        password: {
            type: String,
            required: [true, "Password Is Required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false
        },
        profile_img: {
            type: String,
            default: "/uploads/profile_imgs/profile-default.png"
        }
    },
    {
        timestamps: true
    }
)

// Hash Password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)

