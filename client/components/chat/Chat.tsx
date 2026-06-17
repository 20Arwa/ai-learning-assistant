"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { MessageSquare, Send, Sparkles } from 'lucide-react'
import api from '@/lib/api'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Loading from '../Loading'
import { Input } from '../ui/input'
import { useAuth } from '@/context/AuthContext'
import ReactMarkdown from "react-markdown"
import { Skeleton } from '../ui/skeleton'
import { charMessagesType } from '@/lib/types'
import { Label } from '../ui/label'

const Chat = () => {
    const params = useParams()
    const doc_id = params.id

    const {user} = useAuth()

    const inputRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(false)
    const [isGenerateRes, setIsGenerateRes] = useState(false)
    
    const [userQues, setUserQues] = useState("")
    const [messages, setMessages] = useState<charMessagesType[]>([])
    
    const chatRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight 
        }
    }, [messages, isGenerateRes])
    
    // Fetch Messages IF Exist
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true)
                const res = await api.get(`chat/document/${doc_id}`)
                if (res.data.exists) {
                    setMessages(res.data.messages)
                }
            } catch(err: any) {
                toast.error(err?.response?.data?.message)
            } finally {
                setLoading(false)
            }
        }
        fetchMessages()
    }, [])
    
    const chat = async () => {
        setMessages(prev => [...prev, {role: "user", content: userQues}])
        // Get Ai Response
        try {
            setUserQues("")
            setIsGenerateRes(true)
            const res = await api.post(
                `chat/document/${doc_id}`,
                {user_ques: userQues}
            )
            setMessages(prev => [...prev, {role: "assistant", content: res.data.response}])      
            inputRef.current?.focus()
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        } finally {
            setIsGenerateRes(false)
        }
    }

    return (
        <div>
            <div>
            {loading ? (
                <Loading></Loading>
            ) : messages.length === 0 ? (
                    <div className="flex min-h-[60vh] flex-col gap-1 justify-center items-center text-center">
                        <MessageSquare className="main-button-light p-2 rounded-lg" size={35}></MessageSquare>
                        <h3 className="text-xl">Start a conversation</h3>
                        <p className="text-secondary-foreground">Ask me anything about the document</p>
                    </div>
                ): (
                    <div ref={chatRef} className='h-[60vh] p-4 overflow-y-scroll'>
                        {messages.map((msg, index) => {
                            if (msg.role == "user") {
                                return (
                                    <div key={index} className='flex flex-row-reverse items-start gap-2'>
                                        <p className='button-shape third-button px-2.5 py-1'>{user?.user_name.slice(0,1).toUpperCase()}</p>
                                        <div className='max-w-2/3 lg:max-w-3/5 mb-3 text-white gradient-primary p-2 rounded-l-lg rounded-t-lg'>
                                            <ReactMarkdown>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div key={index} className='flex gap-2'>
                                        <Sparkles className="button-shape main-button p-2" size={30}></Sparkles>
                                        <div className='max-w-2/3 lg:max-w-3/5 mb-3 bg-white p-2 border rounded-r-lg rounded-t-lg'>
                                            <ReactMarkdown>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )
                            }
                        })}

                        {isGenerateRes && 
                            <div className='flex gap-2'>
                                <Sparkles className="button-shape main-button p-2" size={30}></Sparkles>
                                <div className='max-w-1/2 bg-white p-2 border rounded-r-lg rounded-t-lg'>
                                    <div className="flex gap-1 items-center mt-1">
                                        <Skeleton className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" />
                                        <Skeleton className="h-2 w-2 bg-gray-300 rounded-full animate-bounce delay-150" />
                                        <Skeleton className="h-2 w-2 bg-gray-300 rounded-full animate-bounce delay-300" />
                                    </div>        
                                </div>
                            </div>
                        }
                    </div>
                )
            }
            </div>

            <form className='flex gap-1 p-2 border-t' onSubmit={
            (e) =>{
                e.preventDefault()
                chat()
            }}>
                <div className="grow">
                    <Label htmlFor="user_question" className="sr-only"></Label>
                    <Input ref={inputRef} type="text" name="user_question" id="user_question" autoFocus placeholder='Ask anything about this document' value={userQues} onChange={(e) => setUserQues(e.target.value)}/>
                </div>
                <Button type='submit' disabled={userQues == ""} className='mt-1' aria-label="Send question">
                    <Send></Send>
                </Button>
            </form>
        </div>
    )
}

export default Chat