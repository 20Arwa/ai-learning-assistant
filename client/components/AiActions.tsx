"use client"
import { useState } from "react"
import api from '@/lib/api'
import toast from 'react-hot-toast'
import ReactMarkdown from "react-markdown"
import { Sparkles, Lightbulb, ScrollText } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useParams } from "next/navigation"
import { Label } from "./ui/label"

const AiActions = () => {
    const params = useParams()
    const id = params.id
    
    const [summary, setSummary] = useState("")
    const [loadSummary, setLoadSummary] = useState(false)
    const [openSummary, setOpenSummary] = useState(false)

    const [generatedConcept, setGeneratedConcept] = useState("")
    const [concept, setConcept] = useState("")
    const [loadConcept, setLoadConcept] = useState(false)
    const [openConcept, setOpenConcept] = useState(false)
    const [conceptError, setConceptError] = useState("")
    

    const generateSummary = async () => {
        if (summary !== "") {
            setOpenSummary(true)
            return
        } 
        try {
            setLoadSummary(true)
            const res = await api.get(
                `/ai/generateSummary/${id}`
            )
            setSummary(res.data.summary)
            setOpenSummary(true)
            toast.success("Summary generated successfully")
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
        finally {
            setLoadSummary(false)
        }
    }

    const generateConcept = async () => {
        let error = ""

        // Validation
        if (!concept) {
            error = "Concept is required"
        }
        if (concept.length > 100) {
            error = "Concept must be less than 100 characters"
        }

        setConceptError(error)
        if (error.length > 0) return

        try {
            setLoadConcept(true)
            const res = await api.post(
                `/ai/explainConcept/${id}`,
                {concept: concept}
            )
            setGeneratedConcept(res.data.explanation)
            setOpenConcept(true)
            toast.success("concept explanation generated successfully")
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
        finally {
            setLoadConcept(false)
        }
    }
    return (
        <div>
            <div className='flex items-center border-b p-4'>
                <Sparkles className="gradient-primary me-3 p-1.5 rounded-md shadow-sm shadow-primary/50" color="white" size={35}></Sparkles>
                <div>
                    <h2 className='text-xl font-bold'>Ai Assistant</h2>
                    <p className='text-secondary-foreground'>Powered by advanced AI</p>
                </div>
            </div>
            <div className='p-4'>

                {/* Summary */}
                <div className="summary flex flex-col gap-2.5 md:flex-row justify-between items-start p-4 mb-4 border rounded-xl shadow-sm">
                    <div>
                        <div className='flex items-center'>
                            <ScrollText className="bg-blue-100 text-blue-600 me-3 p-1.5 rounded-md shadow-sm shadow-blue/50" size={30}></ScrollText>
                            <h3 className='text-lg font-bold'>Generate summary</h3>
                        </div>
                        <p className='text-secondary-foreground mt-2'>Get a concise summary of the entire document</p>
                    </div>
                    <Dialog open={openSummary} onOpenChange={setOpenSummary}>
                        <Button type="submit" className="flex items-center justify-between button-base main-button" onClick={(generateSummary)} disabled={loadSummary}>
                            {loadSummary ? 
                                <div className="flex items-center w-full max-w-xs gap-1.5 [--radius:1rem]">
                                        <Spinner data-icon="inline-start" />
                                        Generating
                                    </div>
                                : "Summarize"}
                        </Button>
                        <DialogContent className="bg-background w-">
                            <DialogHeader>
                                <DialogTitle className='font-bold'>Generated summary</DialogTitle>
                                <DialogDescription className='sr-only'>Generated summary</DialogDescription>
                            </DialogHeader>
                            <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-6">
                                <div className="flex flex-col gap-y-1.5 leading-normal prose prose-sm max-w-none dark:prose-invert">
                                    {loadSummary ? 
                                    <div className="flex items-center w-full max-w-xs gap-1.5 [--radius:1rem]">
                                        <Spinner data-icon="inline-start" />
                                        Generating summary
                                    </div>
                                    : 
                                        <ReactMarkdown>
                                            {summary}  
                                        </ReactMarkdown>
                                    }
                                </div>   
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Concept */}
                <div className="concept p-4 border rounded-xl shadow-sm">
                    <div>
                        <div className='flex items-center'>
                            <Lightbulb className="bg-yellow-100 text-yellow-600 me-3 p-1.5 rounded-md shadow-sm shadow-yellow/50" size={30}></Lightbulb>
                            <h3 className='text-lg font-bold'>Explain a concept</h3>
                        </div>
                        <p className='text-secondary-foreground mt-2'>Enter a topice or concept from the document to get a detailed explanation</p>
                    </div>
                    <div className='flex items-start gap-x-2 mt-2'>
                        <div className='w-full'>
                            <Label htmlFor="concept" className="sr-only"></Label>
                            <Input className="py-0.5" type="text" name="concept" id="concept" placeholder="e.g.'React Hooks'" error={conceptError} onChange={(e) => setConcept(e.target.value)}></Input>
                        </div>
                        <Dialog open={openConcept} onOpenChange={setOpenConcept}>
                            <Button type="submit" className="mt-1" onClick={(generateConcept)} disabled={loadConcept}>
                                { loadConcept ? 
                                    <div className="flex items-center gap-0.5">
                                        <Spinner data-icon="inline-start" />
                                        explaining
                                    </div>
                                : "Explain"}
                            </Button>
                            <DialogContent className="bg-background">
                                <DialogHeader>
                                    <DialogTitle className='font-bold'>What is {concept}?</DialogTitle>
                                    <DialogDescription className='sr-only'>Concept explanation</DialogDescription>
                                </DialogHeader>
                                <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-6">
                                    <div className="flex flex-col gap-y-1.5 leading-normal prose prose-sm max-w-none dark:prose-invert">
                                        {loadConcept ? 
                                        <div className="flex items-center w-full max-w-xs gap-1.5 [--radius:1rem]">
                                            <Spinner data-icon="inline-start" />
                                            generate Concept explanation...
                                        </div>
                                        : 
                                        <ReactMarkdown>
                                            {generatedConcept}  
                                        </ReactMarkdown>
                                        }
                                    </div>   
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AiActions