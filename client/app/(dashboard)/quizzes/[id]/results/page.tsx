"use client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Result from "./Result"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"
import api from "@/lib/api"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { QuizType } from "@/lib/types"

const page = () => {
    const params = useParams()
    const id = params.id

    const [quiz, setQuiz] = useState<QuizType | null>(null)

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
            const res = await api.get(`quiz/${id}`)
            setQuiz(res.data.quiz)
            } catch(err: any) {
            toast.error(err?.response?.data?.message)
            }
        }
        fetchQuiz() 
    }, [])
    
    if (!quiz) return <Loading></Loading>
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