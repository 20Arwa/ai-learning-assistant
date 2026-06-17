"use client"
import { BrainCircuit, User, Mail, MessageSquare, Sparkles, FileText } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import api from "@/lib/api"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { InputPassword } from "@/components/ui/input_password"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Spinner } from "@/components/ui/spinner"

const Register = () => {
    const [loading, setLoading] = useState(false)
    const {register} = useAuth()
    const [formData, setFormData] = useState({
        user_name: "",
        email: "",
        password: "",
        confirm_password: ""
    })
    const [errors, setErrors] = useState<{
        user_name? : string,
        email? : string,
        password? : string,
        confirm_password? : string,
    }>()

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        let newErrors : {
            user_name?: string,
            email?: string,
            password?: string,
            confirm_password?: string
        } = {}
        
        // User Name Validation
        if (formData.user_name.length < 3) {
            newErrors.user_name = "Username must be at least 3 characters long"
        }

        // Email Validation
        if (formData.email == "") {
            newErrors.email = "Email is required"
        }
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Invalid email"
        }
        
         // Password Validation
        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long"
            }
            else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one capitle letter"
            }
            
        // Confirm Password Validation
        if (!formData.confirm_password) {
            newErrors.confirm_password = "Confirm password is required"
        }
        else if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match"
        }
        
        setErrors(newErrors)
        
        // If There Is Error Return
        if (Object.keys(newErrors).length > 0) return
        
        try {
            setLoading(true)
            const res = await api.post(
                "/auth/register",
                {
                    user_name: formData.user_name, 
                    email: formData.email, 
                    password: formData.password}
            )
            toast.success("Account created successfully")
            register()
        } catch(err : any) {
            toast.error(err?.response?.data?.message || "something went wrong, please try again")
            setFormData(prev => ({...prev, password: "", confirm_password: ""}))        
        }
        finally {
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
                        <BrainCircuit size={50} />
                    </div>
                </div>
                <h1 className="text-5xl font-bold leading-tight mb-5">Learn Smarter with AI</h1>
                <p className="text-xl text-white/90 leading-relaxed mb-10">Upload your study materials and turn them into interactive learning experiences.</p>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <FileText size={20} />
                        <span className="text-lg">Upload PDFs and organize your study materials</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Sparkles size={20} />
                        <span className="text-lg">Generate summaries, flashcards, and quizzes instantly</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <MessageSquare size={20} />
                        <span className="text-lg">ask questions about your documents with AI </span>
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

                {/* Register Card */}
                <div className="bg-card border rounded-3xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary">Create Account</h1>

                        <p className="text-muted-foreground mt-2">Start your AI-powered learning journey today.</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <Label htmlFor="user_name">USERNAME</Label>
                            <Input
                                id="user_name"
                                type="text"
                                placeholder="Your name"
                                icon={User}
                                error={errors?.user_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        user_name: e.target.value,
                                    })
                                }
                            />
                        </div>

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

                        <div className="mb-4">
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

                        <div className="mb-2">
                            <Label htmlFor="confirm_password">CONFIRM PASSWORD</Label>
                            <InputPassword
                                id="confirm_password"
                                placeholder="Confirm your password"
                                error={errors?.confirm_password}
                                value={formData.confirm_password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirm_password: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <Button className="w-full h-11 mt-2" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner data-icon="inline-start" />
                                Create Account
                            </>
                            ): (
                                <>
                                Creating
                            </>
                            )
                        }
                        </Button>
                    </form>
                    <div className="mt-6 pt-6 border-t text-center">
                        <p className="text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </main>
    )
}

export default Register