

"use client"

import api from "@/lib/api"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"
import {Pen, Trash2} from "lucide-react"
import DocumentContent from "@/components/documents/DocumentContent"
import AiActions from "@/components/AiActions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import DocumentFlashcards from "@/components/flashcards/DocumentFlashcards"
import DocumentQuizzes from "@/components/quizzes/DocumentQuizzes"
import Chat from "@/components/chat/Chat"
import { docType } from "@/lib/types"

type propsType = {
    initialDocument: docType
}

const Document =  ({initialDocument}: propsType) => {
    const params = useParams()
    const id = params.id
    const router = useRouter()

    const [doc, setDoc] = useState<docType>(initialDocument)
    const [openUpdateTitle, setOpenUpdateTitle] = useState(false)
    const [newTitle, setNewTitle] = useState<string>("")
    const [error, setError] = useState("")

    // Tab
    const paramsTab = useSearchParams()
    const activeTab = paramsTab.get("tab") || "content"
    const handleTabChange = (tab: string) => {
        router.push(`?tab=${tab}`)
    }

    useEffect(() => {
        if (doc) {
            setNewTitle(doc.doc_name)
        }
    }, [doc])

    // Update Title
    const updateTitle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let errorMsg = ""

        // validation
        if (!newTitle) {
            errorMsg = "Title is required"
        }
        else if (newTitle?.length < 3) {
            errorMsg = "Title must be at least 3 characters"
        }

        setError(errorMsg)

        if (errorMsg) return

        // Update
        try {
            const res = await api.patch(
                `/document/${id}`,
                {
                    newTitle: newTitle 
                }
            )
            toast.success("Document title updated")
            setDoc(res.data.doc)
            setOpenUpdateTitle(false)
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
    }

    // Delete Doc
    const deleteDoc = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        try {
            const res = await api.delete(
            `/document/${id}`
            )
            toast.success("Document deleted")
            router.push("/documents")
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-7">
                {/* Title And Update Title */}
                <div className="flex items-center gap-x-3 mb-2  max-w-5/6 md:max-w-full">
                    <h1 className="truncate">{doc?.doc_name}</h1>

                    {/* Update Title Doc */}
                    <Dialog open={openUpdateTitle} onOpenChange={setOpenUpdateTitle}>
                        <DialogTrigger aria-label="Edit document title" className="focus-visible:outline-none">
                            <div className="button-base secondery-button rounded-full border-1.5 p-1 hover:text-primary-foreground hover:border-primary">
                                <Pen className="" size={16}></Pen>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="bg-background">
                            <form onSubmit={updateTitle}>
                                <DialogHeader className="gap-0">
                                    <DialogTitle className="text-lg">Update document title</DialogTitle>
                                    <DialogDescription className="sr-only">Update document title</DialogDescription>
                                </DialogHeader>
                                <div className="my-5">
                                    <Label htmlFor="newTitle" className="text-secondary-foreground">New document title</Label>
                                    <Input id="newTitle" name="newTitle" className="bg-white" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} error={error}></Input>
                                </div>
                                <DialogFooter className="bg-background">
                                    <DialogClose asChild>
                                    <Button variant="outline" className="bg-background text-foreground w-1/2">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" className="w-1/2">Update title</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Delete Doc */}
                <Dialog >
                    <DialogTrigger className="self-start" aria-label="Delete document">
                        <div className="flex items-center justify-between gap-1 button-base delete-button">
                            <Trash2 size={18}></Trash2>
                            Delete Document
                        </div>
                    </DialogTrigger>
                    <DialogContent className="bg-background">
                    <form onSubmit={(e) => {deleteDoc(e)}}>
                        <DialogHeader className="gap-0">
                            <DialogTitle className="text-lg">Delete document</DialogTitle>
                            <DialogDescription className="sr-only">Delete document</DialogDescription>
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

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full" >
                <TabsList variant="line" className="text-secondary-foreground">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="ai_actions">Ai Actions</TabsTrigger>
                    <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                    <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                    <DocumentContent url_path={doc?.url_path}></DocumentContent>
                </TabsContent>
                <TabsContent value="chat">
                    <Chat></Chat>
                </TabsContent>
                <TabsContent value="ai_actions">
                    <AiActions></AiActions>
                </TabsContent>
                <TabsContent value="flashcards">
                    <DocumentFlashcards></DocumentFlashcards>
                </TabsContent>
                <TabsContent value="quizzes">
                    <DocumentQuizzes></DocumentQuizzes>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default Document








