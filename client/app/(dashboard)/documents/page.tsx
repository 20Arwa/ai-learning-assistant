"use client"
import { docType } from "@/lib/types"
import Documents from "./Documents"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"

const DocumentsPage = () => {
  const [initialDocuments, setInitialDocuments] = useState<docType[] | null>(null)
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await api.get("document/")
        setInitialDocuments(res.data.docs)
      } catch(err: any) {
        toast.error(err?.response?.data?.message)
      }
    }
    fetchDocuments() 
  }, [])
  
  if (!initialDocuments) return <Loading></Loading>
  return (
    <div className="bg-background">
      <Documents initialDocuments={initialDocuments}></Documents>
    </div>
  )
}

export default DocumentsPage