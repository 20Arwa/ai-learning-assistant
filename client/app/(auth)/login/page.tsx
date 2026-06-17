"use client"
import { BrainCircuit, Mail, FileText, BookOpen, MessageSquare} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import api from "@/lib/api"
import {errorMessages} from "@/lib/errorMessages"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { InputPassword } from "@/components/ui/input_password"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Spinner } from "@/components/ui/spinner"

type ErrorKey = "USER_NOT_FOUND";

const Login = () => {
    const {login} = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState<{
        email? : string,
        password? : string
    }>()

    const handlelogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        let newErrors : {
            email?: string,
            password?: string
        } = {}
        
        // Email Validation
        if (formData.email == "") {
            newErrors.email = "Email is required"
        }
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Invalid email"
        }
        
        // Password Validation
        if (!formData.password.length) {
            newErrors.password = "Password is required"
        }

        setErrors(newErrors)
        // If There Is Error Return
        if (Object.keys(newErrors).length > 0) return

        try {
            setLoading(true)
            await login(formData.email, formData.password) 
            toast.success("Logged in successfully")
        } catch(err: any) {
            toast.error(errorMessages[err?.response?.data?.message as ErrorKey] || err?.response?.data?.message)    
            setFormData(prev => ({...prev, password: ""}))        
        } finally {
            setLoading(false)
        }
    }
return (
    <main className="min-h-screen flex bg-background">
        {/* Left Side */}
        <div className="hidden md:flex w-3/5 relative overflow-hidden gradient-primary text-white">

        {/* Background Blur Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col justify-center px-16 lg:px-24 max-w-2xl">
                <div className="mb-6">
                    <div className="inline-flex p-4 rounded-3xl bg-white/15 backdrop-blur-md">
                        <BrainCircuit size={50}/>
                    </div>
                </div>

                <h1 className="text-5xl font-bold leading-tight mb-4">Welcome Back</h1>
                <p className="text-xl text-white/90 leading-relaxed mb-10">Pick up where you left off and continue learning with your AI-powered study workspace.</p>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <FileText size={20} />
                        <span className="text-lg">Access your uploaded documents</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <BookOpen size={20} />
                        <span className="text-lg">Review flashcards, quizzes, and summaries</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <MessageSquare size={20} />
                        <span className="text-lg">Keep asking questions about your documents with AI</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-2/5 flex items-center justify-center p-6 bg-background">
            <div className="w-full max-w-md">

                {/* Mobile Header */}
                <div className="md:hidden text-center mb-10">
                    <div className="inline-flex p-4 rounded-2xl gradient-primary shadow-lg shadow-primary/30 mb-4">
                        <BrainCircuit color="white" size={35} />
                    </div>
                    <h1 className="text-3xl font-bold">Study Smarter</h1>
                    <p className="text-muted-foreground mt-2">AI-powered learning tools for students</p>
                </div>

                {/* Login Card */}
                <div className="bg-card border rounded-3xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary">Sign In</h1>
                        <p className="text-muted-foreground mt-2">Welcome back! Continue your learning journey.</p>
                    </div>

                    <form onSubmit={handlelogin}>
                        <div className="mb-4">
                            <Label htmlFor="email">EMAIL</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                icon={Mail}
                                error={errors?.email}
                                onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                                }
                            />
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="password">PASSWORD</Label>
                            <InputPassword
                                id="password"
                                placeholder="Your password"
                                error={errors?.password}
                                value={formData.password}
                                onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                                }
                            />
                        </div>
                        <Button className="w-full h-11 mt-2" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner data-icon="inline-start" />
                                Signing in...
                            </>
                            ): (
                            <>
                                Sign In
                            </>
                            )
                        }
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t text-center">
                        <p className="text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </main>
)
}

export default Login