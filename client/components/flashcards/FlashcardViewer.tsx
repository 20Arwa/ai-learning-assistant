"use client"
import { Star, RotateCcw, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Button } from "../ui/button"
import api from "@/lib/api"
import toast from "react-hot-toast"
import { flashcardType } from "@/lib/types"

type propsType = {
    flashcard: flashcardType | null,
    setFlashcard?:  React.Dispatch<React.SetStateAction<flashcardType | null>>,
    setFlashcardSets?:  React.Dispatch<React.SetStateAction<flashcardType[]>>,
}
const FlashcardViewer = ({flashcard, setFlashcard, setFlashcardSets}: propsType) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const [flippediD, setFlippediD] = useState<string | null>()
    const router = useRouter()

    useEffect(() => {
        if (!carouselApi) {return}

        setCount(carouselApi.scrollSnapList().length)

        const handleSelect = async () => {
            const index = carouselApi.selectedScrollSnap()

            setCurrent(index + 1)

            const currentQuestion = flashcard?.questions[index]

            if (currentQuestion) {
                if (!currentQuestion.reviewed) {
                    await updateReviewed(currentQuestion._id)
                }
            }
        }

        handleSelect()

        carouselApi.on("select", handleSelect)

        return () => {
            carouselApi.off("select", handleSelect)
        }
    }, [carouselApi, flashcard?.questions])

    // Update Reviewed 
    const updateReviewed = async (qusetion_id: string) => {
        try {
            const res = await api.patch(
                `/flashcard/${flashcard?._id}/questions/${qusetion_id}`,
                {reviewed: true}
            )
            // Update Flashcards Array
            if (setFlashcardSets) {
                setFlashcardSets((prev) =>
                    prev.map((flashcard_map) => {
                        if (flashcard?._id !== flashcard_map._id) {return flashcard_map}
                        return res.data.flashcard
                    })
                )
            }
            // Update Flashcard
            if (setFlashcard) 
                setFlashcard(res.data.flashcard)

            toast.success("Flashcard reviewed")
        } catch (err: any) {
            toast.error(err?.response?.data?.message)
        }
    }
    
    // Update Favorite 
    const updateFavorite = async (qusetion_id: string, favorite: boolean) => {
        try {
            const res = await api.patch(
                `/flashcard/${flashcard?._id}/questions/${qusetion_id}`,
                {favorite: !favorite}
            )
            // Update Flashcards Array
            if (setFlashcardSets) {
                setFlashcardSets((prev) =>
                    prev.map((flashcard_map) => {
                        if (flashcard?._id !== flashcard_map._id) {return flashcard_map}
                        return res.data.flashcard
                    })
                )
            }
            // Update Flashcard
            if (setFlashcard) 
                setFlashcard(res.data.flashcard)

            if (favorite) 
                toast.success("Removed from favorites")
            else 
                toast.success("Added to favorites")
            } catch (err: any) {
            toast.error(err?.response?.data?.message)
        }
    }

    const deleteflashcard = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        try {
            const res = await api.delete(
            `/Flashcard/${flashcard?._id}`
            )
            toast.success("Flashcards deleted")
            if (setFlashcardSets) {
                if (setFlashcard) {
                    setFlashcard(null)
                    setFlashcardSets((prev) => prev.filter((flashcard_filter) => flashcard?._id !== flashcard_filter._id))
                }
            }
            else {
                router.push("/flashcards")
            }
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center my-5">
                <h1>Flashcard</h1>
                <Dialog>
                    <DialogTrigger aria-label="Delete flashcard">
                        <div className="flex items-center justify-between gap-1 button-base delete-button">
                            <Trash2 size={18} className="text-errors"></Trash2>
                            Delete Flashcard
                        </div>
                    </DialogTrigger>
                    <DialogContent className="bg-background">
                        <form onSubmit={(e) => {deleteflashcard(e)}}>
                            <DialogHeader className="gap-0">
                                <DialogTitle className="text-lg">Delete Flashcards</DialogTitle>
                                <DialogDescription className="sr-only">Delete Flashcards</DialogDescription>
                            </DialogHeader>
                            <div className="my-5">Are you sure you want to delete this Flashcards?</div>
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

            <Carousel setApi={setCarouselApi} className="w-full relative border rounded-xl max-w-[90%] lg:max-w-[80%] mt-10 mb-15  mx-auto">
                <CarouselContent className="">
                    {flashcard?.questions.map((question, index) => {
                        const isFlipped = flippediD === question._id
                        return (
                            <CarouselItem key={question._id}  className="rounded-md">
                                <div className="perspective-[1000px] rounded-md">
                                    <div className={`relative duration-500 w-full h-62.5 lg:h-75 rounded-md [transform-style:preserve-3d] ${isFlipped ? "rotate-y-[180deg]" : ""}`}>
                                        <Card className="front absolute inset-0 [backface-visibility:hidden] shadow-lg rounded-md gap-0">
                                            <CardHeader className="flex justify-between items-center">
                                                <p className="third-button py-1 px-2 rounded-md">{question.difficulty}</p>
                                                <button 
                                                    className={`group button-base p-2 border ${question.favorite ? "bg-yellow-400 shadow-xs shadow-yellow-400/50 hover:border-secondary-foreground/30 hover:shadow-none" : "third-button"}`}
                                                    onClick={() => updateFavorite(question._id, question.favorite)}
                                                    aria-label="Favorite"
                                                >
                                                    <Star className={`transition-colors ${question.favorite ? "fill-white stroke-white" : "text-muted-foreground group-hover:fill-yellow-400 group-hover:stroke-yellow-400"} `} size={15}></Star>
                                                </button>
                                            </CardHeader>
                                            <CardContent className="aspect-square h-full flex flex-col justify-center text-center gap-10 cursor-pointer" onClick={() => setFlippediD(question._id)}>
                                                <p className="text-lg">{question.question}</p>
                                                <div className="text-secondary-foreground flex items-center justify-center gap-1.5">
                                                    <RotateCcw size={15}></RotateCcw>
                                                    <p>Click to reveal answer</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="back text-white gradient-primary absolute inset-0 [backface-visibility:hidden] rotate-y-[180deg] rounded-xl" onClick={() => setFlippediD(null)}>
                                            <CardHeader className="flex justify-end">
                                            </CardHeader>
                                            <CardContent className="aspect-square h-full flex flex-col justify-center text-center gap-10 cursor-pointer">
                                                <p className="text-lg">{question.answer}</p>
                                                <div className="text-white flex items-center justify-center gap-1.5">
                                                    <RotateCcw size={15}></RotateCcw>
                                                    <p>Click to see question</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>

                <div className="w-full absolute -bottom-11.25 right-[50%] translate-x-[50%] bg-red flex items-stretch justify-center gap-5">
                    <CarouselPrevious className="static translate-y-0" />
                    <p className="secondery-button py-0.5 px-2.5 rounded-md">{current} / {count}</p>
                    <CarouselNext className="static translate-y-0" />
                </div>
            </Carousel>
        </div>
    )
}

export default FlashcardViewer