import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import serverApi from "@/lib/serverApi"
import Flashcard from "./Flashcard"

type PropsType = {
    params: Promise<{
        id: string
    }>
}

const Page = async ({ params }: PropsType) => {
    const { id } = await params
    const api = await serverApi()

    const res = await api.get(`flashcard/${id}`)
    const initialFlashcard = res.data.flashcard

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








