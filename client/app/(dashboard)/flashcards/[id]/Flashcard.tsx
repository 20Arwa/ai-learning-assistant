

"use client"
import { useState } from "react"
import { flashcardType } from "@/lib/types"
import FlashcardViewer from "@/components/flashcards/FlashcardViewer"

type propsType = {
    initialFlashcard: flashcardType
}

const Flashcard = ({initialFlashcard}: propsType) => {
    const [flashcard, setFlashcard] = useState<flashcardType | null>(initialFlashcard)

    return (
        <div>
            <FlashcardViewer flashcard={flashcard} setFlashcard={setFlashcard}></FlashcardViewer>
        </div>
    )
}

export default Flashcard








