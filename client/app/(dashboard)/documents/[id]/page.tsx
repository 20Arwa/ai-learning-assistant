"use client"
import {ArrowLeft} from "lucide-react"
import Link from "next/link"
import Document from "./Document"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { docType } from "@/lib/types"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"
import { useParams } from "next/navigation"

const Page = () => {
    const params = useParams()
    const id = params.id

    const [initialDocument, setInitialDocument] = useState<docType | null>(null)

    useEffect(() => {
        const fetchDocument = async () => {
        try {
            const res = await api.get(`document/${id}`)
            setInitialDocument(res.data.doc)
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
        }
        fetchDocument() 
    }, [])
    
    if (!initialDocument) return <Loading></Loading>
    return (
        <div>
            <Link href={"/documents"} className="flex items-center gap-x-1 text-muted-foreground hover:text-secondary-foreground transition">
                <ArrowLeft size={18}></ArrowLeft>
                <p>Back to documents</p>
            </Link>
            <Document initialDocument={initialDocument}></Document>
        </div>
    )
}
export default Page








