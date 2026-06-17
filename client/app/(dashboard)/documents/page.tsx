import { docType } from "@/lib/types"
import serverApi from "@/lib/serverApi"
import Documents from "./Documents"

const DocumentsPage = async () => {
  const api = await serverApi()

  const res = await api.get("document/")
  const initialDocuments: docType[] = res.data.docs

  return (
    <div className="bg-background">
      <Documents initialDocuments={initialDocuments}></Documents>
    </div>
  )
}

export default DocumentsPage