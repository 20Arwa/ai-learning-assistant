"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {useRouter} from "next/navigation"
import api from "@/lib/api"
import toast from "react-hot-toast"
import { userType } from "@/lib/types"

type AuthcontextTypes = {
    user: userType | null,
    setUser: React.Dispatch<React.SetStateAction<userType | null>>,
    loading: boolean,
    register: () => Promise<void>,
    login: () => Promise<void>,
    logout: () => Promise<void>
}

const Authcontext = createContext<AuthcontextTypes | null>(null)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<userType|null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/getProfile")
                setUser(res.data)
            } catch (err: any) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    const register = async () => {
        try {
            const res = await api.get("/auth/getProfile")
            setUser(res.data)
            router.push("/dashboard")
        } catch(err) {
            toast.error("Failed to fetch user")
        }
    }
    
    const login = async () => {
        try {
            const res = await api.get("/auth/getProfile")
            setUser(res.data)
            router.push("/dashboard")
        } catch(err) {
            toast.error("Failed to fetch user")
        }
    }
    
    const logout = async () => {
        toast.success("Logged out")
        await api.post("/auth/logout")
        setUser(null)
        router.replace("/login")
    }

    return (
        <Authcontext.Provider value={{user, setUser, loading, register, login, logout}}>
            {children}
        </Authcontext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(Authcontext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
} 