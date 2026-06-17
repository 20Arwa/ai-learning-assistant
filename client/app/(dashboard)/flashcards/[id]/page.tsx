"use client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Flashcard from "./Flashcard"
import api from "@/lib/api"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { flashcardType } from "@/lib/types"
import Loading from "@/components/Loading"

const Page = () => {

    const params = useParams()
    const id = params.id

    const [initialFlashcard, setInitialFlashcard] = useState<flashcardType | null>(null)

    useEffect(() => {
        const fetchFlashcard = async () => {
        try {
            const res = await api.get(`flashcard/${id}`)
            setInitialFlashcard(res.data.flashcard)
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
        }
        fetchFlashcard() 
    }, [])
    
    if (!initialFlashcard) return <Loading></Loading>
    return (
        <div>
            <Link href={"/flashcards"} className="flex items-center gap-x-1 text-muted-foreground hover:text-secondary-foreground transition">
                <ArrowLeft size={18}></ArrowLeft>
                <p>Back to flashcards</p>
            </Link>
            <Flashcard initialFlashcard={initialFlashcard}></Flashcard>
        </div>
    )
}

export default Page








