"use client"

import { Plus, FileText, Trash2, Clock4, Upload, Layers, BadgeQuestionMark } from "lucide-react"
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
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import api from "@/lib/api"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Spinner } from "@/components/ui/spinner"
import { docType } from "@/lib/types"
import EmptyContent from "@/components/EmptyContent"

type propsType = {
    initialDocuments: docType[]
}

const Documents = ({initialDocuments}: propsType) => {
    dayjs.extend(relativeTime)

    const [docs, setDocs] = useState<docType[]>(initialDocuments)
    const [uploadedFile, setUploadedFile] = useState<File | null>()
    const [isUploading, setIsUploading] = useState(false)
    const [docTitle, setDocTitle] = useState("")
    const [error, setError] = useState<{
        title?: string,
        file?: String
    }>()
    const [openUploadDialog , setOpenUploadDialog ] = useState(false)
    const [deleteDocId, setDeleteDocId ] = useState<null | string>()

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setUploadedFile(file)
        
        if (file) {
            setDocTitle(file.name.replace(".pdf",""))
            setError({
                title: undefined,
                file: undefined
            })
        }
    }

    const uploadDoc = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!uploadedFile) return

        // Validation
        let errorMsg : {
            title?: string,
            file?: String
        } = {}

        if (!uploadedFile) {
            errorMsg.file = "No file provided"
        }
        else if (uploadedFile.size > 10 * 1024 * 1024) {
            errorMsg.file = "Maximum file size is 10MB"
        }

        
        if (docTitle.length == 0) {
            errorMsg.title = "Title is required"
        }
        else if (docTitle.length < 3) {
            errorMsg.title = "Title must be at least 3 characters"
        }
        setError(errorMsg)


        if (Object.keys(errorMsg).length > 0) return

        const formData = new FormData()
        formData.append("uploadedDoc", uploadedFile)
        formData.append("docTitle", docTitle.replace(".pdf", ""))

        // Add File
        try {
            setIsUploading(true)
            const res = await api.post(
            "/document/",
            formData
            )
            toast.success("Document uploaded")
            setOpenUploadDialog(false)
            setDocs((prev) => [...prev, res.data.data])
            setUploadedFile(null)
            setDocTitle("")

        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        } finally {
            setIsUploading(false)
        }
    }

    const deleteDoc = async (e: React.FormEvent<HTMLFormElement>, _id: String) => {
        e.preventDefault()
        
        try {
            const res = await api.delete(
            `/document/${_id}`
            )
            toast.success("Document deleted")
            // Update Docs
            const filterDocs = docs.filter((doc) => deleteDocId != doc._id)
            setDocs(filterDocs)
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
    }

    return (
    <div >
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-start mb-10">
            <div>
                <h1>My Documents</h1>
                <p className="text-secondary-foreground">Manage and organize your learning materials</p>
            </div>
        
        <div className="mt-5 md:mt-0 md:ml-auto">
            <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
                <DialogTrigger>
                    <div className="flex items-center justify-between button-base main-button">
                    <Plus size={20}></Plus>
                    Upload Document
                    </div>
                </DialogTrigger>
                <DialogContent className="bg-background">
                    <form onSubmit={uploadDoc}>
                        <DialogHeader className="gap-0">
                            <DialogTitle className="text-lg">Upload new document</DialogTitle>
                            <DialogDescription>Add a PDF file to your library</DialogDescription>
                        </DialogHeader>
                        <div className="mt-3">
                            <Label htmlFor="doc_title" className="text-secondary-foreground">Document title</Label>
                            <Input id="doc_title" name="doc_title" placeholder="Enter document title" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} error={error?.title}></Input>
                            <div className="mt-2">
                                <label htmlFor="doc_file" className="text-secondary-foreground">PDF file
                                <div className="h-35 flex flex-col justify-center items-center mt-1 p-1.5 py-1 border-2 rounded-md border-border cursor-pointer bg-white">
                                    <Upload className="text-primary bg-primary-light p-2 px-2.5 rounded-lg mb-2" size={40}></Upload>
                                    <h2 className="text-primary">{uploadedFile?.name}</h2>
                                    <input type="file" name="doc_file" id="doc_file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => handleFile(e)}/>
                                    <p className="from-secondary-foreground text-xs">PDF Up to 10MB</p>
                                </div>
                                </label>
                                {error?.file && (<p className="text-sm text-errors">{error.file}</p>)}
                            </div>
                        </div>
                        <DialogFooter className="bg-background">
                            <DialogClose asChild>
                                <Button variant="outline" className="bg-background text-foreground w-1/2">Cancel</Button>
                            </DialogClose>
                        <Button type="submit" className="w-1/2" disabled={isUploading}>
                            {isUploading ? (
                            <>
                                <Spinner data-icon="inline-start" />
                                uploading
                            </>
                            ): (
                                <>
                                Upload
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

    { docs.length === 0 ? (
        <EmptyContent  
            title={"No documents yet"} 
            description={"Upload your first document to start generating flashcards, quizzes and AI-powered study tools."} 
            icon={FileText}
        ></EmptyContent>
    ) : (
    <div className="grid rounded-md grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {docs.map((doc) => (
        <div key={doc._id} className="relative bg-white hover:bg-primary/4 border hover:border-primary rounded-lg hover:scale-[1.01] transition transition-300">
            <div className="absolute top-4 right-4">
                <Dialog open={deleteDocId == doc._id} onOpenChange={(open) => {
                    if (open) {
                    setDeleteDocId(doc._id)
                    } else {
                    setDeleteDocId(null)
                    }
                }}>
                    <DialogTrigger aria-label="Delete document">
                    <Trash2 className="text-muted-foreground hover:text-errors transition cursor-pointer" size={18}></Trash2>
                    </DialogTrigger>
                    <DialogContent className="bg-background">
                        <form onSubmit={(e) => {deleteDoc(e, doc._id)}}>
                            <DialogHeader className="gap-0">
                                <DialogTitle className="text-lg">Delete document</DialogTitle>
                                <DialogDescription className="sr-only">
                                Delete document
                                </DialogDescription>
                            </DialogHeader>
                            <div className="my-5">Are you sure you want to delete this document?</div>
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
            
            <Link href={`/documents/${doc._id}`} className="block p-5 md:p-4">
                <FileText className="text-white gradient-primary p-2 rounded-lg shadow-md shadow-primary/50" size={32}></FileText>
                <h2 className="text-lg mt-3 font-bold truncate">{doc.doc_name.replace(/\.[^/.]+$/, "")}</h2>
                <p className="text-sm text-secondary-foreground mb-2 mt-1">{(doc.size / 1024).toFixed(1)} KB</p>

                <div className="flex items-center gap-x-2 text-sm">
                    <div className="flex items-center button-shape bg-[#f3e7fa] text-[#6a15a5] border border-[#6a15a5]/50">
                        <Layers className="me-1" size={16}></Layers>
                        <p>{doc.flashcardsCount || 0} Flashcards</p>
                    </div>
                    <div className="flex items-center button-shape main-button-light">
                        <BadgeQuestionMark className="me-1" size={18}></BadgeQuestionMark>
                        <p>{doc.quizzesCount || 0} Quizzes</p>
                    </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground border-t mt-4 pt-3">
                    <Clock4 className="me-1" size={15}></Clock4>
                    <p>Uploaded {dayjs(doc.createdAt).fromNow()}</p>
                </div>
            </Link>
        </div>
        ))}
    </div>
    )
    }
    </div>
    )
}

export default Documents