import  mongoose, {Schema} from "mongoose"

const chatSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        doc_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Chat = mongoose.model("Chat", chatSchema)