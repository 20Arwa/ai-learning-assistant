"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { InputPassword } from "@/components/ui/input_password"
import { User, Mail, Pen } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"


const Profile = () => {
    const {user, setUser, loading} = useAuth()

    const [profileForm, setProfileForm] = useState({
        user_name: "",
        email: ""
    })
    const [password, setPassword] = useState({
        current_pass: "",
        new_pass: "",
        confirm_new_pass: ""
    })
    const [errors, setErrors] = useState<{
        user_name? : string,
        email? : string,
        current_pass?: string,
        new_pass?: string,
        confirm_new_pass?: string
    }>()

    useEffect(() => {
        if (user) {
            setProfileForm({
                user_name: user.user_name,
                email: user.email,
            })
        }
    },[user])

    const isProfileUnchanged = profileForm.user_name !== user?.user_name || profileForm.email !== user?.email

    const isPasswordDirty  = password?.current_pass && password?.new_pass && password.confirm_new_pass


    // Update User Name Or Email
    const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Validiation And Errors
        let newErrors : {
            user_name?: string,
            email?: string
        } = {}

        // User Name Validation
        if (profileForm.user_name.length < 3) {
            newErrors.user_name = "Username must be at least 3 characters long"
        }
        
        // Email Validation
        if (profileForm.email == "") {
            newErrors.email = "Email is required"
        }
        else if (!/^\S+@\S+\.\S+$/.test(profileForm.email)) {
            newErrors.email = "Invalid email"
        }
        
        setErrors(newErrors)
        
        // If There Is Error Return
        if(Object.keys(newErrors).length > 0 ) return
        
        // Update
        try {
            const res = await api.patch(
                "/auth/updateProfile",
                {user_name:profileForm.user_name, email: profileForm.email}
            )
            setUser(prev => {
                if (!prev) return null
                return {
                    ...prev,
                    user_name: res.data.user_name,
                    email: res.data.email
                }
            })
            toast.success("Profile updated successfully")
        } catch(err: any) {
            toast.error(err?.response?.data?.message)
        }
    }

    // Change Profile Image
    const changeProfileImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) return

        const formData = new FormData()
        formData.append("profile_img", file)
        
        try {
            const res = await api.patch(
                "auth/changeProfileImg",
                formData
            )
            setUser(prev => {
                if (!prev) return null
                return {
                    ...prev,
                    profile_img: `${res.data.profile_url}?t=${Date.now()}`
                }
            })
            toast.success("Profile image updated")
        } catch(err: any) {
            toast.error(err.response?.data?.message)
        }
    }

    // Change Password
    const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        let newErrors : {
            current_pass?: string,
            new_pass?: string,
            confirm_new_pass?: string
        } = {}

        // Validation
        if (password.new_pass.length < 6) {
            newErrors.new_pass = "Password must be at least 6 characters long"
        }
        else if (!/[A-Z]/.test(password.new_pass)) {
            newErrors.new_pass = "Password must contain at least one capitle letter"
        }
        if (!password.confirm_new_pass) {
            newErrors.confirm_new_pass = "Confirm password is required"
        }
        else if (password.new_pass !== password.confirm_new_pass) {
            newErrors.confirm_new_pass = "Passwords do not match"
        }
        setErrors(newErrors)
        // If There Is errors return
        if (Object.keys(newErrors).length > 0) return

        try {
            const res = await api.patch(
                "/auth/changePassword",
                {
                    current_password: password.current_pass,
                    new_password: password.new_pass
                }
            )
            toast.success("Password changed successfully")
            setPassword({
                current_pass: "",
                new_pass: "",
                confirm_new_pass: ""
            })
        } catch(err: any) {
            if (err?.response?.data?.message == "INVALID_PASSWORD") {
                setErrors(prev => ({...prev, current_pass: "Incorrect password"}))
            }
            else {
                toast.error(err?.response?.data?.message)
            }
        }
    }
return (
    <div className="bg-background">
        {loading ? (
            <Loading></Loading>
        ): (
        <>
        <h1>Profile Settings</h1>

        <div className="bg-secondary shadow-md p-5 my-8 rounded-lg">
            <h2 className="text-lg font-bold">User information</h2>

            {/* Profile Image */}
            <div className="profile-img my-5">
                <div className="relative w-fit">
                     {user?.profile_img && 
                    <Image src={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${user.profile_img}`} alt="Profile img" width={96} height={96} className="w-24 h-24 border-2 rounded-full" unoptimized></Image>
                    }
                    <Label htmlFor="profile_img" className="group absolute bottom-0 right-0 button-base main-button-light border-1.5 border-primary opacity-90 hover:opacity-100 rounded-full p-1.5">
                        <Pen className="text-primary-foreground" width={15} height={15} strokeWidth={2}>
                        </Pen>
                    </Label>
                    <input type="file" accept="image/*" onChange={changeProfileImg} name="profile_img" id="profile_img" className="hidden"/>
                </div>
            </div>

            {/* Username And Email */}
            <form onSubmit={updateProfile}>
                <div className="user_name mb-3">
                    <Label htmlFor="user_name">USERNAME</Label>
                        <Input 
                            id="user_name" 
                            type="text" 
                            placeholder="your name" 
                            value={profileForm.user_name} 
                            onChange={(e) => setProfileForm({...profileForm, user_name: e.target.value})} 
                            icon={User}>
                        </Input>
                    {errors?.user_name && (<p className="text-sm text-errors">{errors?.user_name}</p>)}
                </div>

                <div className="email mb-3">
                    <Label htmlFor="email">EMAIL</Label>
                        <Input 
                            id="email" 
                            type="text" 
                            placeholder="you@exmple.com" 
                            value={profileForm.email} 
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} 
                            icon={Mail}>
                        </Input>
                    {errors?.email && (<p className="text-sm text-errors">{errors?.email}</p>)}
                </div>

                <Button type="submit" disabled={!isProfileUnchanged} className="mt-3 text-right">Update profile</Button>
            </form>
        </div>

        {/* Change Password */}
        <div className="bg-secondary shadow-md p-5 rounded-lg">
            <h2 className="text-lg font-bold mb-5">Change password</h2>
            <form onSubmit={changePassword}>
                <div className="current_password mb-3">
                    <Label htmlFor="current_password">Current password</Label>
                        <InputPassword id="current_password" value={password.current_pass ?? ""}  onChange={(e) => setPassword({...password, current_pass: e.target.value})} error={errors?.current_pass}></InputPassword>
                    {/* {errors?.current_pass && (<p className="text-sm text-errors">{errors?.current_pass}</p>)} */}
                </div>

                <div className="new_password mb-3">
                    <Label htmlFor="new_password">New password</Label>
                        {/* <Input id="new_password" type="password" value={password.new_pass ?? ""} onChange={(e) => setPassword({...password, new_pass: e.target.value})} icon={Lock}></Input> */}
                        <InputPassword id="new_password" value={password.new_pass ?? ""} onChange={(e) => setPassword({...password, new_pass: e.target.value})} error={errors?.new_pass}></InputPassword>
                    {/* {errors?.new_pass && (<p className="text-sm text-errors">{errors?.new_pass}</p>)} */}
                </div>

                <div className="confirm_new_password mb-3">
                    <Label htmlFor="confirm_new_password">Confirm new password</Label>
                        <InputPassword id="confirm_new_password" value={password.confirm_new_pass ?? ""}  onChange={(e) => setPassword({...password, confirm_new_pass: e.target.value})}  error={errors?.confirm_new_pass}></InputPassword>
                    {/* {errors?.confirm_new_pass && (<p className="text-sm text-errors">{errors?.confirm_new_pass}</p>)} */}
                </div>

                <Button type="submit" disabled={!isPasswordDirty} className="mt-3 text-right">Change password</Button>
            </form>
        </div>
        </>
        )
        }
    </div>
    )
}

export default Profile