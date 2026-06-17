"use client"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { flashcardType } from "@/lib/types"
import Favorites from "./Favorites"
import { favCardsType } from "@/lib/types"
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import api from "@/lib/api"
import toast from "react-hot-toast"



const page = () => {
    const [favorites, setFavorites] = useState<favCardsType[] | null>(null)
    
    useEffect(() => {
        const fetchFlashcard = async () => {
        try {
            const res = await api.get(`flashcard/`)  

            const favs: favCardsType[] = []

            res.data.flashcards.forEach((flashcard: flashcardType) => {
                flashcard.questions.forEach((question) => {
                if (question.favorite) {
                    favs.push({
                    ...question,
                    flashcard_id: flashcard._id,
                    })
                }
                })
            })

            setFavorites(favs)
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
        }
        fetchFlashcard() 
    }, [])
    
    

    if (!favorites) return <Loading></Loading>
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

