const textChunker = (text, chunkSize = 500, overlap = 100) => {

    const words = text.split(" ")
    const chunks = []
    let start = 0

    while (start < words.length) {
        const end = start + chunkSize
        const chunk = words.slice(start, end).join(" ")
        const cleanedChunk = chunk.replace(/--\s*\d+\s*of\s*\d+\s*--/g, "").trim()
        chunks.push(cleanedChunk)
        start += chunkSize - overlap
    }

    return chunks
}
export default textChunker