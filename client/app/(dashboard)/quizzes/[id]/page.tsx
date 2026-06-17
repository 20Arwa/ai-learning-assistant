"use client"
import { useParams } from "next/navigation"
import Quiz from "./Quiz"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { QuizType } from "@/lib/types"

const page = () => {
  const params = useParams()
    const id = params.id

    const [initialQuiz, setInitialQuiz] = useState<QuizType | null>(null)

    useEffect(() => {
      const fetchQuiz = async () => {
        try {
          const res = await api.get(`quiz/${id}`)
          setInitialQuiz(res.data.quiz)
        } catch(err: any) {
          toast.error(err?.response?.data?.message)
        }
      }
      fetchQuiz() 
    }, [])
    
  if (!initialQuiz) return <Loading></Loading>
  return (
    <div>
      <Quiz initialQuiz={initialQuiz}></Quiz>
    </div>
  )
}

export default page