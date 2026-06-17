"use client"

import { Layers, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { flashcardType } from "@/lib/types"
import EmptyContent from "@/components/EmptyContent"

type propsType = {
    flashcards: flashcardType[]
}

const Flashcards = ({flashcards}: propsType) => {
    dayjs.extend(relativeTime)

return (
    <div className="bg-background">
        {  flashcards.length === 0 ? (
        <EmptyContent
            title={"No Flashcards yet"} 
            description={"Generate flashcards from your documents to start learning and reinforce your knowledge."} 
            icon={Layers}
        ></EmptyContent>
        ) : (
        <div className="grid rounded-md grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {flashcards.map((flashcard) => {
                const reviewedNum = flashcard.questions.filter((question) => question.reviewed)
                const progress = (reviewedNum.length / flashcard.questions.length) * 100
                return (
                    <div key={flashcard._id} className="relative bg-white border p-4 rounded-lg shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="button-shape main-button-light p-2 flex items-center justify-center">
                                <Layers size={18} />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-bold truncate">{flashcard.doc_id?.doc_name ?? "Unknown Document"}</h2>
                                <p className="text-sm text-secondary-foreground">Created {dayjs(flashcard.createdAt).fromNow()}</p>
                            </div>
                        </div>
        
                        <div className="w-full flex items-center gap-3 my-4">
                            <p className="w-fit button-shape secondery-button text-sm border">{flashcard.questions.length} cards</p>
                            {progress > 0 &&
                                <div className="flex items-center gap-1 w-fit button-shape main-button-light text-sm border border-primary/20">
                                    <TrendingUp size={15}></TrendingUp>
                                    <p>{progress}%</p>
                                </div>
                            }
                        </div>
        
                        <div>
                            <div className="flex justify-between items-center text-sm">
                                <p>Progress</p>
                                <p>{reviewedNum.length}/{flashcard.questions.length} reviewed</p>
                            </div>
                            <div className="h-1.5 rounded-xl mt-1 mb-7 bg-gray-200">
                                <span className="gradient-primary h-full block rounded-xl" style={{width:`${progress}%`}}></span>
                            </div>
                        </div>
        
                        <Link href={`/flashcards/${flashcard._id}`} className="flex justify-center items-center gap-1.5 button-base gradient-primary text-white">
                            <Sparkles size={18}></Sparkles>
                            Study Now
                        </Link>
                    </div>
                    )}
                )
            }
        </div>
        )
    }
    </div>
    )
}

export default Flashcards