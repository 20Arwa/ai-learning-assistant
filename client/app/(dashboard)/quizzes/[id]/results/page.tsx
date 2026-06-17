import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import serverApi from "@/lib/serverApi"
import Result from "./Result"

type PropsType = {
    params: Promise<{
        id: string
    }>
}

const page = async({ params }: PropsType) => {
    const { id } = await params
    const api = await serverApi()

    const res = await api.get(`quiz/${id}`)
    const quiz = res.data.quiz

    return (
        <div>
            <Link href={`/documents/${quiz?.doc_id._id}?tab=quizzes`} className="text-sm flex items-center gap-x-1 text-muted-foreground hover:text-secondary-foreground transition">
                <ArrowLeft size={18}></ArrowLeft>
                <p>Back to quizzes</p>
            </Link>
            <h1 className="my-5">{quiz?.doc_id.doc_name}</h1>
            <Result quiz={quiz}></Result>
        </div>
    )
}

export default page