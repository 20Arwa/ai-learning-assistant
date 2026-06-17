"use client"
import { ArrowLeft, Trash2, Check, CircleCheck } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import toast from "react-hot-toast"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { QuizType } from "@/lib/types"

type propsType = {
    initialQuiz: QuizType
}

const Quiz = ({initialQuiz}: propsType) => {
  const router = useRouter()

  const [quiz, setQuiz] = useState<QuizType>(initialQuiz)
  const [doc_id, setDoc_id] = useState<string>()
  const [answeredNum, setAnsweredNum] = useState(0)

  // Carosul
  const [apiCarousel, setApiCarousel] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const CarouselProgress = (current * 100) / count;

  const questionRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!apiCarousel) return

    setCount(apiCarousel.scrollSnapList().length)
    setCurrent(apiCarousel.selectedScrollSnap() + 1)

    const onSelect = () => {
      const index = apiCarousel.selectedScrollSnap()

      setCurrent(index + 1)

      questionRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }

    apiCarousel.on("select", onSelect)

    return () => {
      apiCarousel.off("select", onSelect)
    }
  }, [apiCarousel])

  
  useEffect(() => {
    setDoc_id(quiz.doc_id._id)
  }, [])

  useEffect(() => {
    const unAnswered = quiz?.questions.filter((question) => question.selected_index !== undefined) || []    
    setAnsweredNum(unAnswered.length)
  }, [quiz])

  // Update Score
  const checkUnAnswered = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const unAnswered = quiz?.questions.filter((question) => question.selected_index === undefined) || []
    const hasUnAnswered = unAnswered?.length > 0
    
    if (!hasUnAnswered) updateScore(e)
  }

  const updateScore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Calculate Score
    let score = 0
    if (quiz) {
      let rightAnswers = quiz.questions.filter((question) => question.selected_index == question.c)
      score = Math.round((rightAnswers?.length / quiz.questions.length) * 100)
    }

    // Update Route
    try {
      const res = await api.patch(
        `/quiz/${quiz?._id}`,
        {questions: quiz?.questions, score: score}
      )
    } catch (err: any) {
      toast.error(err?.response?.data?.message)
    }

    // Redirect router.push
    router.push(`${quiz?._id}/results`) 
  }

  // Delete Quiz
  const deleteQuiz = async (e: React.FormEvent<HTMLFormElement>, _id?: String) => {
    e.preventDefault()
    try {
      const res = await api.delete(
      `/quiz/${_id}`
      )
      toast.success("Quizzes deleted")
      router.push(`/documents/${doc_id}?tab=quizzes`)
    } catch(err: any) {
      toast.error(err?.response?.data?.message)
    }
}
  return (
    <div>
        {/* Exit Page */}
        <Dialog>
          <DialogTrigger className="flex items-center gap-1 text-errors opacity-70 hover:opacity-100 transition cursor-pointer">
            <ArrowLeft size={18}></ArrowLeft>
            <p>Exit quiz</p>
          </DialogTrigger>
          <DialogContent className="bg-background">
            <DialogHeader className="gap-0">
              <DialogTitle className="text-lg">Exit quiz?</DialogTitle>
              <DialogDescription className="sr-only">Exit quiz confirmation</DialogDescription>
            </DialogHeader>
            <div className="my-2">Your progress will be lost. Are you sure?</div>
            <DialogFooter className="bg-background">
              <DialogClose asChild>
              <Button variant="outline" className="bg-background text-foreground w-1/2">Cancel</Button>
              </DialogClose>
                <Link href={`/documents/${quiz?.doc_id._id}?tab=quizzes`} className="w-1/2 ">
                  <Button variant={"destructive"} className="w-full">Exit</Button>
                </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      <div className="flex justify-between mb-8 mt-10">
        <h1>{quiz?.doc_id.doc_name}</h1>

        <Dialog>
          <DialogTrigger aria-label="Delete quiz">
            <div className="flex items-center justify-between gap-1 button-base delete-button">
              <Trash2 size={15}></Trash2>
              Delete Quiz
            </div>
          </DialogTrigger>
          <DialogContent className="bg-background">
            <form onSubmit={(e) => {deleteQuiz(e, quiz?._id)}}>
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

      <Field className="w-full max-w-[90%] lg:max-w-[80%] mx-auto mb-4 g-0">
        <FieldLabel htmlFor="progress-upload">
          <span>Question {current} of {count}</span>
          <span className="ml-auto">{answeredNum} answered</span>
        </FieldLabel>
        <Progress className="ml-auto w-24" value={CarouselProgress} />
      </Field>

      <Carousel className="w-full rounded-xl max-w-[90%] lg:max-w-[80%] mx-auto" setApi={setApiCarousel}>
        <CarouselContent>
          {quiz?.questions.map((question) => (
            <CarouselItem key={question._id}>   
              <Card className="inset-0 rounded-xl gap-0">
                <CardHeader>
                  <div className="w-fit flex items-center gap-1.5 button-shape main-button-light">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <p>Question {current}</p>
                  </div>
                </CardHeader>
                <CardContent className="min-h-60 h-full flex flex-col justify-center text-center gap-5 mt-5">
                  <h2 className="text-lg text-start">{question.q}</h2>
                  <RadioGroup className="w-full" onValueChange={(value) => {
                    // Change Quiz State When Answer
                    setQuiz((prev) => {
                      if (!prev) return prev
                      return {
                        ...prev,
                        questions: prev.questions.map((question_map) => {
                          if (question_map._id != question._id) return question_map
                          return {...question_map,selected_index: Number(value)}
                        })
                      }
                    })
                  }}>
                    {question.o.map((option, index) => (
                      <FieldLabel key={index} htmlFor={`question_${question._id}_option_${index}`} >
                        <Field orientation="horizontal" className="flex-row-reverse text-start cursor-pointer hover:bg-background">
                          <FieldContent>
                            <FieldTitle>{option}</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value={index.toString()} id={`question_${question._id}_option_${index}`} />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Controller */}
        <div className="flex justify-between items-center mt-5">
          <CarouselPrevious className="static translate-0 " />
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide custom-scrollbar max-w-[50%] mt-3.5 pb-2">
              {Array.from({ length: count }).map((_, index) => (
              <Button
                ref={(el) => {questionRefs.current[index] = el}}
                className={cn("w-7 h-7 rounded-md border border-primary-light p-3",
                  {"secondery-button border-muted-foreground":current !== index + 1,}
                )}
                key={index}
                onClick={() => apiCarousel?.scrollTo(index)}
              >
                {quiz?.questions[index]?.selected_index !== undefined ? 
                <Check></Check>
                :
                  index + 1
                }
              </Button>
            ))}
          </div>
          {current == count ? (
            count == answeredNum ? (
              <form onSubmit={(e) => checkUnAnswered(e)}>
                <Button type="submit" className="py-1">
                  <CircleCheck></CircleCheck>
                  Submit
                </Button>
              </form>
            ) : (
              <Dialog>
                <DialogTrigger className="main-button flex items-center gap-1 text-sm button-base py-1">
                  <CircleCheck size={18}></CircleCheck>
                  Submit
                </DialogTrigger>
                <DialogContent className="bg-background">
                  <form onSubmit={(e) => {updateScore(e)}}>
                    <DialogHeader className="gap-0">
                      <DialogTitle className="text-lg">Submit Quiz</DialogTitle>
                      <DialogDescription className="sr-only">Submit Quiz</DialogDescription>
                    </DialogHeader>
                    <div className="my-5">
                      <p>You still have {count - answeredNum} unanswered questions.</p>
                      <p>Are you sure you want to submit?</p>
                    </div>    
                    <DialogFooter className="bg-background">
                      <DialogClose asChild>
                      <Button variant="outline" className="bg-background text-foreground w-1/2">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" className="w-1/2">Submit</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )
          ): (
            <CarouselNext className="static translate-0 gradient-primary text-white hover:gradient-primary hover:text-white" />
          )
          }
        </div>
      </Carousel>
    </div>
  )
}

export default Quiz