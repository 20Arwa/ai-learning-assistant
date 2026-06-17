"use client"
import { BookOpen, CheckCircle, CircleCheck, CircleMinus, CircleX, Target, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { QuizType } from "@/lib/types"

type propsType = {
    quiz: QuizType
}

const Result = ({quiz}: propsType) => {
    const scoreMsgClr = quiz
        ? quiz.score >= 80
        ? { message: "Excellent work!", color: "text-primary" }
        : quiz.score >= 50
        ? { message: "Good progress", color: "text-yellow-500" }
        : { message: "Keep practicing", color: "text-red-500" }
        : null

    const correctAns = quiz ?
        quiz.questions.filter((question) => question.c === question.selected_index).length
        : null
    const incorrectAns = quiz ?
        quiz.questions.filter((question) => question.selected_index != null && question.c !== question.selected_index).length
        : null
    const unAnsweredAns = quiz ?
        quiz.questions.filter((question) => question.selected_index == null).length
        : null

    return (
        <div>
            <Card className="inset-0 rounded-xl gap-0">
                <CardHeader className="justify-center mb-3">
                    <div className="button-shape main-button-light p-2 flex items-center justify-center">
                        <Trophy size={20} />
                    </div>
                    {/* <Trophy size={40} className="button-shape main-button-light"></Trophy> */}
                </CardHeader>
                <CardContent className="text-center text-secondary-foreground">
                    <p>Your score</p>
                    <h2 className={`text-3xl my-1 font-bold ${scoreMsgClr?.color}`}>{quiz?.score}%</h2>
                    <p>{scoreMsgClr?.message}</p>
                    <div className="mt-5 flex justify-center flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 button-shape secondery-button">
                            <Target size={15}></Target>
                            <p>{quiz?.questions.length} Total</p>
                        </div>
                        <div className="flex items-center gap-1.5 button-shape correct-button">
                            <CircleCheck size={15}></CircleCheck>
                            <p>{correctAns} Correct</p>
                        </div>
                        <div className="flex items-center gap-1.5 button-shape incorrect-button">
                            <CircleX size={15}></CircleX>
                            <p>{incorrectAns} Incorrect</p>
                        </div>
                        <div className="flex items-center gap-1.5 button-shape third-button">
                            <CircleMinus size={15}></CircleMinus>
                            <p>{unAnsweredAns} UnAnswered</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-10">
                <div className="flex items-center gap-2">
                    <BookOpen size={20}></BookOpen>
                    <h2>Detailed Review</h2>
                </div>

                {quiz?.questions.map((question, index) => {
                    const isRightAns = question.c === question.selected_index
                    const isSelectedIndex = question.selected_index != null
                    return (
                    <Card key={question._id} className="inset-0 rounded-xl gap-0 my-3">
                        <CardHeader className="flex justify-between">
                            <div className="w-fit flex items-center gap-1.5 button-shape secondery-button">Question {index + 1}</div>
                            <div className={`button-shape px-1.5 text-sm ${!isSelectedIndex ? "third-button" :isRightAns ? "correct-button" : "incorrect-button"}`}>
                                {!isSelectedIndex ? (<CircleMinus size={17}></CircleMinus>)
                                : isRightAns ?
                                (<CircleCheck size={17}></CircleCheck>)
                                : (<CircleX size={17}></CircleX>)
                                }
                            </div>
                        </CardHeader>
                        <CardContent className="min-h-60 h-full flex flex-col justify-center gap-3 mt-5">
                            <h2 className="text-lg text-start">{question.q}</h2>
                            <div className="options w-full">
                                {question.o.map((option, index) => {
                                    const correctAns = index === question.c
                                    const wrongAns = question.selected_index != null && index === question.selected_index && question.selected_index !== question.c
                                    return (
                                    <div key={index} className={`min-h-10 flex justify-between items-center gap-1.5 button-shape secondery-button mb-2 ${correctAns ? "correct-button" : ""} ${wrongAns ? "incorrect-button": ""}`}>
                                        {option}
                                        {correctAns ? (
                                            <div className="text-sm flex items-center py-0.5 gap-1 button-shape correct-button">
                                                <CheckCircle size={15}></CheckCircle>
                                                <p>correct</p>
                                            </div>
                                        ) : wrongAns ? (
                                            <div className="text-sm flex items-center px-1.5 py-0.5 gap-1 button-shape incorrect-button">
                                                <CircleX size={15}></CircleX>
                                                <p>selected</p>
                                            </div>
                                        ) : null
                                        }
                                    </div>
                                    )
                                })}
                            </div>
                            {!isRightAns && 
                                <div className="text-start flex flex-col md:flex-row items-start gap-2.5 p-2.5 button-shape secondery-button">
                                    <div className="button-shape third-button p-2">
                                        <BookOpen  size={18}></BookOpen>
                                    </div>
                                    <div>
                                        <h3>Explanation</h3>
                                        <p>{question.e}</p>
                                    </div>
                                </div>
                            }
                        </CardContent>
                    </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default Result