import mongoose, {Schema} from "mongoose";

const documentShema = new Schema (
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true

        },
        doc_name: {
            type: String,
            required: true,
        },
        url_path: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        chunks: {
            type: [String],
        }
    }, 
    {
        timestamps: true
    }
)

export const Document = mongoose.model("Document", documentShema)