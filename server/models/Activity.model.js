import  mongoose, {Schema} from "mongoose"

const activitySchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: ["document", "flashcard", "quiz"],
            required: true
        },
        action: {
            type: String,
            required: true
        },
        doc_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: null
        },
        doc_name: {
            type: String,
        }
    }, 
    { 
        timestamps: true 
    }
);

export const Activity = mongoose.model("Activity", activitySchema)

