"use client"
import { Star, RotateCcw, Layers } from "lucide-react"
import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import api from "@/lib/api"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { favCardsType } from "@/lib/types"
import EmptyContent from "@/components/EmptyContent"

type propsType = {
    favCards: favCardsType[]
}

const Favorites = ({favCards}: propsType) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const [flippediD, setFlippediD] = useState<string | null>()
    const [questions, setQuestions] = useState<favCardsType[]>(favCards)
    
    useEffect(() => {
        if (!carouselApi) return

        carouselApi.reInit()

        const updateCarousel = () => {
            setCount(carouselApi.scrollSnapList().length)
            setCurrent(carouselApi.selectedScrollSnap() + 1)
        }

        updateCarousel()

        carouselApi.on("select", updateCarousel)
        carouselApi.on("reInit", updateCarousel)

        return () => {
            carouselApi.off("select", updateCarousel)
            carouselApi.off("reInit", updateCarousel)
        }
    }, [carouselApi, questions])

    // Update Favorite 
    const updateFavorite = async (flashcard_id: string, qusetion_id: string, favorite: boolean) => {
        try {
            const res = await api.patch(
                `/flashcard/${flashcard_id}/questions/${qusetion_id}`,
                {favorite: !favorite}
            )

            // Update Flashcards Array
            setQuestions((prev) => prev.filter((question) => qusetion_id !== question._id))

            toast.success("Removed from favorites")
    
            } catch (err: any) {
            toast.error(err?.response?.data?.message)
        }
    }

return (
    <div>
        {questions.length === 0 ? (
        <EmptyContent
            title={"No favorite flashcards yet"} 
            description={"Study your flashcards and save your favorites to review them later."} 
            icon={Layers}
        ></EmptyContent>
        ) : (
        <Carousel setApi={setCarouselApi} className="w-full relative border rounded-xl max-w-[90%] lg:max-w-[80%] mt-5 mb-15  mx-auto">
            <CarouselContent className="">
                {questions.map((question, index) => {
                    const isFlipped = flippediD === question._id
                    return (

                    <CarouselItem key={question._id}  >
                        <div className="perspective-[1000px">
                            <div className={`relative duration-500 w-full h-62.5 lg:h-75 [transform-style:preserve-3d] ${isFlipped ? "rotate-y-[180deg]" : ""}`}>
                                <Card className="front absolute inset-0 [backface-visibility:hidden] rounded-xl gap-0">
                                    <CardHeader className="flex justify-between items-center">
                                        <p className="button-shape third-button py-1 px-2 rounded-md">{question.difficulty}</p>
                                        <Button
                                            className="group p-2 bg-none bg-yellow-400 shadow-xs shadow-yellow-400/50 hover:bg-slate-200 hover:shadow-none transition"
                                            onClick={() => updateFavorite(question.flashcard_id ,question._id, question.favorite)}
                                            aria-label="Remove from favorites"
                                        >
                                            <Star className="fill-white" size={20}></Star>
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="aspect-square h-full flex flex-col justify-center text-center gap-10 cursor-pointer" onClick={() => setFlippediD(question._id)}>
                                        <p className="text-lg">{question.question}</p>
                                        <div className="text-secondary-foreground flex items-center justify-center gap-1.5">
                                            <RotateCcw size={15}></RotateCcw>
                                            <p>Click to reveal answer</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="back text-white absolute inset-0 [backface-visibility:hidden] rotate-y-[180deg] rounded-xl gradient-primary" onClick={() => setFlippediD(null)}>
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

            <div className="w-full absolute -bottom-11.25 right-[50%] translate-x-[50%] bg-red flex items-center justify-center gap-5">
                <CarouselPrevious className="static translate-y-0" />
                <p className="secondery-button py-0.5 px-2.5 rounded-md">{current} / {count}</p>
                <CarouselNext className="static translate-y-0" />
            </div>
        </Carousel>
        )
    }






        
    </div>
    )
}

export default Favorites

