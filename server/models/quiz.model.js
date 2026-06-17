import mongoose, {Schema} from "mongoose";

const quizShema = new Schema (
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
                q: {
                    type: String,
                    required: true
                },
                // Options
                o: {
                    type: [String],
                    required: true
                },
                // Correct Index Number
                c: {
                    type: Number,
                    required: true
                },
                // Explanation
                e: {
                    type: String,
                    required: true
                },
                selected_index: {
                    type: Number,
                },
            }
        ],
        score: {
            type: Number
        }
    }, 
    {
        timestamps: true
    }
)

export const Quiz = mongoose.model("Quiz", quizShema)