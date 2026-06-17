"use client"
import { Star } from "lucide-react"
import Link from "next/link"
import { flashcardType } from "@/lib/types"
import Flashcards from "./Flashcards"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"

const Page = () => {
    const [flashcards, setFlashcards] = useState<flashcardType[] | null>(null)

    useEffect(() => {
        const fetchFlashcards = async () => {
        try {
            const res = await api.get("flashcard/")
            setFlashcards(res.data.flashcards)
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
        }
        fetchFlashcards() 
    }, [])
    
if (!flashcards) return <Loading></Loading>
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