import  mongoose, {Schema} from "mongoose"

const documentChunkSchema = new mongoose.Schema({
    doc_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },

    chunk_index: {
        type: Number,
        required: true
    },

    text: {
        type: String,
        required: true
    },

    embedding: {
        type: [Number],
        required: true
    }
})

export const DocumentChunk = mongoose.model("DocumentChunk", documentChunkSchema)