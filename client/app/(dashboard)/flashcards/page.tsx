
import { Star } from "lucide-react"
import Link from "next/link"
import { flashcardType } from "@/lib/types"
import serverApi from "@/lib/serverApi"
import Flashcards from "./Flashcards"

const Page = async () => {
    const api = await serverApi()

    const res = await api.get("flashcard/")
    const flashcards: flashcardType[] = res.data.flashcards

return (
    <div className="bg-background">
        <div className="flex justify-between items-center mb-5">
            <h1>Flashcards</h1>
            <Link 
                href={"/flashcards/favorites"} 
                aria-label="Favorite flashcards"
                className="p-2 bg-yellow-400 shadow-xs shadow-yellow-400/50 rounded-md transition hover:scale-[1.04] hover:border-secondary-foreground/30 hover:shadow-none"
            >
                <Star className="fill-white stroke-white" size={15}></Star>
            </Link>
        </div>

        {/* Flashcardss */}
        <Flashcards flashcards={flashcards}></Flashcards>
    </div>
    )
}

export default Page