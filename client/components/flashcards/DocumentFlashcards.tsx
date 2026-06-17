"use client"

import { Trash2, Sparkles, Layers, ArrowLeft } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Skeleton } from "@/components/ui/skeleton"
import Flashcard from "./FlashcardViewer"
import { useParams } from "next/navigation"
import { flashcardType } from "@/lib/types"

const DocumentFlashcards = () => {
    dayjs.extend(relativeTime)

    const params = useParams()
    const doc_id = params.id

    const [loading, setLoading] = useState(false)
    const [generateLoading, setGenerateLoading] = useState(false) // When Generate Flashcards
    const [flashcards, setFlashcards] = useState<flashcardType[]>([])
    const [flashcard, setFlashcard] = useState<null | flashcardType>(null)
    const [deleteflashcardId, setDeleteflashcardId ] = useState<null | string>()
    
    useEffect(() => {
        const fetchFlashcards = async () => {
            setLoading(true)
                try {
                const res = await api.get(`/flashcard/document/${doc_id}`)
                    setFlashcards(res.data.flashcards)
                } catch(err: any) {
                    toast.error(err?.response?.data?.message)
                } finally {
                    setLoading(false)
                }
        }
        fetchFlashcards() 
    }, [])
    
    const generateFlashcard = async () => {
        setGenerateLoading(true)
        try {
            const res = await api.post(`flashcard/document/${doc_id}`)
            toast.success("Flashcard created")
            setFlashcards((prev) => [...prev, res.data.flashcard])
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
        finally {
            setGenerateLoading(false)
        }
    }

    const deleteflashcard = async (e: React.FormEvent<HTMLFormElement>, _id: String) => {
        e.preventDefault()
        
        try {
            const res = await api.delete(
            `/Flashcard/${_id}`
            )
            toast.success("Flashcards deleted")
            // Update Flashcards
            const filterFlashcards = flashcards.filter((flashcard) => deleteflashcardId != flashcard._id)
            setFlashcards(filterFlashcards)
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
    }

    return (
        <div className="p-4">
            { flashcard ? (
                <div>
                    <button 
                    className="flex items-center gap-x-1 text-secondary-foreground hover:text-foreground transition cursor-pointer" 
                    onClick={() => setFlashcard(null)}
                >
                    <ArrowLeft size={18}></ArrowLeft>
                    <p>Back to sets</p>
                </button>
                    <Flashcard flashcard={flashcard} setFlashcard={setFlashcard} setFlashcardSets={setFlashcards}></Flashcard>
                </div>
            ) : loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({length: 6}).map((_, index) => (
                    <Skeleton key={index} className="w-full h-40 rounded-xl" />
                )
                )}
                </div>

            ) : flashcards.length === 0 ? (
                <div className="flex min-h-[60vh] flex-col gap-1 justify-center items-center text-center">
                    <Layers className="main-button-light p-2 rounded-lg shadow-md shadow-primary/50 mb-2" size={35}></Layers>
                    <h3 className="text-xl">No Flashcardss yet</h3> 
                    <p className="text-secondary-foreground">Generate flashcards from your document to start learning and reinforce your knowledge.</p>
                    <Button className="mt-5" onClick={generateFlashcard} disabled={generateLoading}>
                        {generateLoading ? (
                            <>
                                <Spinner data-icon="inline-start" />
                                Generating
                            </>
                            ): (
                                <>
                                    <Sparkles size={20}></Sparkles>
                                    Generate Flashcards
                                </>
                            )
                        }
                    </Button>
                </div>
            ) : (
            <div>
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-start mb-10">
                    <div>
                    <h1 className="text-xl">Your flashcards sets</h1>
                    <p className="text-secondary-foreground">{flashcards.length} set available</p>
                    </div>
                    
                    <div className="mt-5 md:mt-0 md:ml-auto">
                        <Button className="mt-5 md:mt-0" onClick={generateFlashcard} disabled={generateLoading}>
                            {generateLoading ? (
                                <>
                                    <Spinner data-icon="inline-start" />
                                    Generating                                    
                                </>
                                ): (
                                    <>
                                        <Sparkles size={20}></Sparkles>
                                        Generate Flashcards
                                    </>
                                )
                            }
                        </Button>
                    </div>
                </div>
                
                <div className="grid rounded-md grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {flashcards.map((flashcard, index) => (
                    <div key={flashcard._id} className="relative bg-white shadow-sm hover:bg-primary/4 border hover:border-primary rounded-lg hover:scale-[1.01] hover:shadow-lg transition duration-300">
                        <div className="absolute top-4 right-4">
                            <Dialog open={deleteflashcardId == flashcard._id} onOpenChange={(open) => {
                                if (open) {
                                setDeleteflashcardId(flashcard._id)
                                } else {
                                setDeleteflashcardId(null)
                                }
                            }}>
                                <DialogTrigger aria-label="Delete flashcard">
                                <Trash2 className="text-muted-foreground hover:text-errors transition cursor-pointer" size={18}></Trash2>
                                </DialogTrigger>
                                <DialogContent className="bg-background">
                                    <form onSubmit={(e) => {deleteflashcard(e, flashcard._id)}}>
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
                        
                        <button className="cursor-pointer w-full text-left  p-5 md:p-4" onClick={() => setFlashcard(flashcard)}>
                            <Layers className="button-shape main-button-light p-2" size={32}></Layers>
                            <h2 className="text-lg font-bold mt-5">Flashcard set ({index + 1})</h2>
                            <p className="text-sm text-secondary-foreground mb-5 mt-1">Created {dayjs(flashcard.createdAt).fromNow()}</p>
                            <div className="w-full pt-2 border-t">
                                <p className="w-fit button-shape main-button-light ">{flashcard.questions.length} cards</p>
                            </div>
                        </button>
                    </div>
                    ))}
                </div>
            </div>
            )
        }
        </div>
    )
}

export default DocumentFlashcards