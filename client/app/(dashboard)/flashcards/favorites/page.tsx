import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { flashcardType } from "@/lib/types"
import serverApi from "@/lib/serverApi"
import Favorites from "./Favorites"
import { favCardsType } from "@/lib/types"



const page = async () => {
    const api = await serverApi()

    const res = await api.get(`flashcard/`)

    const favorites: favCardsType[] = []

    res.data.flashcards.forEach((flashcard: flashcardType) => {
        flashcard.questions.forEach((question) => {
            if (question.favorite) {
                favorites.push({
                    ...question,
                    flashcard_id: flashcard._id
                })
            }
        })
    })

    return (
        <div>
            <Link href={"/flashcards"} className="flex items-center gap-x-1 text-muted-foreground hover:text-secondary-foreground transition">
                <ArrowLeft size={18}></ArrowLeft>
                <p>Back to flashcards</p>
            </Link>
            <div className="mt-8 flex items-center gap-2">
                <Button className="group p-1.5 bg-none bg-yellow-400 shadow-xs shadow-yellow-400/50 hover:bg-slate-200 hover:shadow-none transition" aria-label="Favorite">
                    <Star className="fill-white" size={10}></Star>
                </Button>
                <h1>Favorites flashcards</h1>
            </div>
            <Favorites favCards={favorites}></Favorites>
        </div>
    )
}

export default page

