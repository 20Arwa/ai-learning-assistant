import mongoose, {Schema} from "mongoose";

const flashcardShema = new Schema (
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true

        },
        doc_id: {
            type: Schema.Types.ObjectId,
            ref: "Document",
            required: true

        },
        questions: [
            {
                question: {
                    type: String,
                    required: true
                },
                answer: {
                    type: String,
                    required: true
                },
                difficulty : {
                    type: String,
                    enum: ["easy", "medium", "hard"],
                    required: true
                },
                reviewed: {
                    type: Boolean,
                    default: false,
                },
                favorite: {
                    type: Boolean,
                    default: false,
                },
            }
        ]
    }, 
    {
        timestamps: true
    }
)

export const Flashcard = mongoose.model("Flashcard", flashcardShema)