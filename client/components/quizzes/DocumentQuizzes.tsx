"use client"

import { Plus, Trash2, Award, Play, ChartNoAxesColumn, RotateCcw, BadgeQuestionMark, Sparkles } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"
import { QuizType } from "@/lib/types"

const DocumentQuizzes = () => {
    dayjs.extend(relativeTime)

    const params = useParams()
    const doc_id = params.id

    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [generateLoading, setGenerateLoading] = useState(false) // When Generate Quizzes
    const [quizzes, setQuizzes] = useState<QuizType[]>([])
    const [quiz, setQuiz] = useState<QuizType>()
    const [openGenerateDialog, setOpenGenerateDialog ] = useState(false)
    const [deleteQuizId, setDeleteQuizId ] = useState<null | string>()
    
    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true)
                try {
                const res = await api.get(`/quiz/document/${doc_id}`)
                    setQuizzes(res.data.quizzes)
                } catch(err: any) {
                    toast.error(err?.response?.data?.message)
                } finally {
                    setLoading(false)
                }
        }
        fetchQuizzes()
    }, [])
    
    
    
    const generateQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = new FormData(e.currentTarget)
        const questions_num = form.get("questions_num")

        setGenerateLoading(true)
            try {
                const res = await api.post(
                    `quiz/document/${doc_id}`,
                    {questions_num: questions_num}
                )
                toast.success("Quiz created")
                setQuizzes((prev) => [...prev, res.data.quiz])
            } catch(err: any) {
                toast.error(err?.response?.data?.message)
            }
            finally {
                setOpenGenerateDialog(false)
                setGenerateLoading(false)
            }
        }

        const retakeQuiz = async (_id: String) => {            
            try {
                const res = await api.patch(
                `/quiz/${_id}/retake/`
                )
                router.push(`/quizzes/${_id}/`)
            } catch(err: any) {
                toast.error(err?.response?.data?.message)
            }
        }

        const deleteQuiz = async (e: React.FormEvent<HTMLFormElement>, _id: String) => {
            e.preventDefault()
            
            try {
                const res = await api.delete(
                `/quiz/${_id}`
                )
                toast.success("Quizzes deleted")
                // Update Quizzes
                const filterQuizzes = quizzes.filter((flashcard) => deleteQuizId != flashcard._id)
                setQuizzes(filterQuizzes)
            } catch(err: any) {
                toast.error(err?.response?.data?.message)
            }
        }

    return (
        <div className="p-4">
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({length: 6}).map((_, index) => (
                    <Skeleton key={index} className="w-full h-40 rounded-xl" />
                )
                )}
                </div>
            ) : quizzes.length === 0 ? (
                <div className="flex min-h-[60vh] flex-col gap-1 justify-center items-center text-center">
                    <BadgeQuestionMark className="main-button-light p-2 rounded-lg mb-2" size={35}></BadgeQuestionMark>
                    <h3 className="text-xl">No Quizzess yet</h3> 
                    <p className="text-secondary-foreground">Generate A quiz from your document to start learning and reinforce your knowledge.</p>
                    <div className="mt-5">
                        <Dialog open={openGenerateDialog} onOpenChange={setOpenGenerateDialog}>
                            <DialogTrigger>
                                <div className="flex items-center justify-between gap-1 button-base main-button">
                                    <Sparkles size={20}></Sparkles>
                                    Generate Quizzes
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-background">
                                <form onSubmit={(e) => {generateQuiz(e)}}>
                                    <DialogHeader className="gap-0">
                                        <DialogTitle className="text-lg">Generate new quiz</DialogTitle>
                                        <DialogDescription className="sr-only">Generate new quiz</DialogDescription>
                                    </DialogHeader>
                                    <div className="my-5">
                                        <Label htmlFor="questions_num">Number of questions</Label>
                                        <Input type="number" id="questions_num" name="questions_num" defaultValue={5} min={1} max={20}></Input>
                                    </div>
                                    <DialogFooter className="bg-background">
                                        <DialogClose asChild>
                                        <Button variant="outline" className="bg-background text-foreground w-1/2">Cancel</Button>
                                        </DialogClose>
                                        <Button className="w-1/2" disabled={generateLoading}>
                                            {generateLoading ? (
                                                <>
                                                    <Spinner data-icon="inline-start" />
                                                    Generating
                                                </>
                                                ): (
                                                    <>
                                                        Generate
                                                    </>
                                                )
                                            }
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            ) : (
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-start mb-10">
                    <div className="mt-5 md:mt-0 md:ml-auto">
                        <Dialog open={openGenerateDialog} onOpenChange={setOpenGenerateDialog}>
                            <DialogTrigger>
                                <div className="flex items-center justify-between gap-1 button-base main-button">
                                    <Plus size={20}></Plus>
                                    Generate Quizzes
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-background">
                        <form onSubmit={(e) => {generateQuiz(e)}}>
                            <DialogHeader className="gap-0">
                                <DialogTitle className="text-lg">Generate new quiz</DialogTitle>
                                <DialogDescription className="sr-only">Generate new quiz</DialogDescription>
                            </DialogHeader>
                            <div className="my-5">
                                <Label htmlFor="questions_num">Number of questions</Label>
                                <Input type="number" id="questions_num" name="questions_num" defaultValue={5} min={1} max={20}></Input>
                            </div>
                            <DialogFooter className="bg-background">
                                <DialogClose asChild>
                                <Button variant="outline" className="bg-background text-foreground w-1/2">Cancel</Button>
                                </DialogClose>
                                <Button className="w-1/2" disabled={generateLoading}>
                                    {generateLoading ? (
                                        <>
                                            <Spinner data-icon="inline-start" />
                                            Generating
                                        </>
                                        ): (
                                            <>
                                                Generate
                                            </>
                                        )
                                    }
                                </Button>
                            </DialogFooter>
                        </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                
                <div className="grid rounded-md grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {quizzes.map((quiz, index) => (
                    <div key={quiz._id} className="relative border shadow-sm p-4 rounded-lg transition transition-300">
                        <div className="absolute top-4 right-4">
                            <Dialog open={deleteQuizId == quiz._id} onOpenChange={(open) => {
                                if (open) {
                                setDeleteQuizId(quiz._id)
                                } else {
                                setDeleteQuizId(null)
                                }
                            }}>
                                <DialogTrigger aria-label="Delete quiz">
                                <Trash2 className="text-muted-foreground hover:text-errors transition cursor-pointer" size={18}></Trash2>
                                </DialogTrigger>
                                <DialogContent className="bg-background">
                                    <form onSubmit={(e) => {deleteQuiz(e, quiz._id)}}>
                                        <DialogHeader className="gap-0">
                                            <DialogTitle className="text-lg">Delete Quizzes</DialogTitle>
                                            <DialogDescription className="sr-only">Delete Quizzes</DialogDescription>
                                        </DialogHeader>
                                        <div className="my-5">Are you sure you want to delete this Quizzes?</div>
                                        <DialogFooter className="bg-background">
                                            <DialogClose asChild>
                                            <Button variant="outline" className="bg-background text-foreground w-1/2">Cancel</Button>
                                            </DialogClose>
                                            <Button variant={"destructive"} type="submit" className="w-1/2">Delete</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                            <div className="w-fit flex items-center gap-1 button-shape main-button-light py-1 px-2">
                                <Award size={13}></Award>
                                <p>Score: {quiz.score != null ? quiz.score : "-"}</p>
                            </div>

                            <h2 className="text-lg font-bold mt-3 truncate">{quiz.doc_id.doc_name} ({index + 1})</h2>
                            <p className="text-sm text-secondary-foreground mb-2">Created {dayjs(quiz.createdAt).fromNow()}</p>

                            <p className="w-fit button-shape secondery-button px-2 py-1 my-4.5 rounded-md">{quiz.questions.length} questions</p>
                            {quiz.score != null ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link 
                                        href={`/quizzes/${quiz._id}/results`} 
                                        className="button-base third-button p-2 flex items-center justify-center gap-1.5" 
                                        onClick={() => setQuiz(quiz)}
                                    >
                                        <ChartNoAxesColumn size={15}></ChartNoAxesColumn>
                                        View results
                                    </Link>
                                    <Dialog>
                                        <DialogTrigger>
                                            <div className="flex items-center justify-center p-2 gap-1.5 button-base main-button-light hover:bg-primary-light hover:text-primary hover:border-primary">
                                                <RotateCcw size={15}></RotateCcw>
                                                Retake quiz
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="bg-background">
                                            <form onSubmit={(e) =>{
                                                e.preventDefault()
                                                retakeQuiz(quiz._id)
                                            }}>
                                                <DialogHeader className="gap-0">
                                                    <DialogTitle className="text-lg">Retake quiz</DialogTitle>
                                                    <DialogDescription className="sr-only">Retake quiz</DialogDescription>
                                                </DialogHeader>
                                                <div className="my-5">Your previous attempt and score will be reset. Are you sure you want to retake this quiz?</div>
                                                <DialogFooter className="bg-background">
                                                    <DialogClose asChild>
                                                    <Button variant="outline" className="bg-background text-foreground w-1/2">Cancel</Button>
                                                    </DialogClose>
                                                    <Button variant={"destructive"} type="submit" className="w-1/2">Retake</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            ) : (
                                <Link 
                                    href={`/quizzes/${quiz._id}`} 
                                    className="w-full flex items-center justify-center gap-1.5 button-base main-button" 
                                    onClick={() => setQuiz(quiz)}
                                >
                                    <Play size={15}></Play>
                                    Start Quiz
                                </Link>
                                )
                            }
                    </div>
                    ))}
                </div>
            </div>
            ) 
        }
        </div>
    )
}

export default DocumentQuizzes