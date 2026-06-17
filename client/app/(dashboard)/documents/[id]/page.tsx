import {ArrowLeft} from "lucide-react"
import Link from "next/link"
import serverApi from "@/lib/serverApi"
import Document from "./Document"

type PropsType = {
    params: Promise<{
        id: string
    }>
}

const Page = async ({ params }: PropsType) => {
    const { id } = await params

    const api = await serverApi()

    const res = await api.get(`document/${id}`)
    const initialDocument = res.data.doc

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








