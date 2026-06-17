import mongoose from "mongoose"

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection
    }

    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB Connected:", connectionInstance.connection.host)
        return connectionInstance
    } catch (err) {
        console.error("MongoDB connection error:", err)
        process.exit(1)
    }
}

export default connectDB