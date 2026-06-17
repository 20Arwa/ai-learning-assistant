import serverApi from "@/lib/serverApi"
import Quiz from "./Quiz"

type PropsType = {
  params: Promise<{
    id: string
  }>
}

const page = async ({ params }: PropsType) => {
  const { id } = await params
  const api = await serverApi()

  const res = await api.get(`quiz/${id}`)
  const initialQuiz = res.data.quiz

  return (
    <div>
      <Quiz initialQuiz={initialQuiz}></Quiz>
    </div>
  )
}

export default page