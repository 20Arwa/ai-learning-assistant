import Link from 'next/link'
import {ExternalLink} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

type props = {
    url_path?: string
}

const DocumentContent = ({url_path}: props) => {
    return (
        <div>
            <div className='flex justify-between border-b p-4'>
                <h2>Document Viewer</h2>
                <Link 
                    href={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/${url_path}`} 
                    target='_blank' 
                    rel="noopener noreferrer" 
                    className='flex items-center gap-x-1 text-blue-700'
                >
                    <ExternalLink size={15}></ExternalLink>
                    <p>Open in new tap</p>
                </Link>
            </div>
            {
                url_path? 
                    <iframe 
                        src={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/${url_path}`}
                        className='w-full h-screen p-1.5 rounded-lg'
                    >
                    </iframe>
                :
                <div className="w-full min-h-175 p-2.5 [--radius:1rem]">
                    <div className="flex items-center gap-0.5">
                        <Spinner data-icon="inline-start" />
                        Loading
                    </div>
                </div>
            }
        </div>
    )
}
export default DocumentContent