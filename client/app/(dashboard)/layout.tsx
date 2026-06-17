"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { BrainCircuit, LayoutDashboard, TextAlignJustify, FileText, BookOpen, User, LogOut } from "lucide-react"
import { usePathname } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import Loading from '@/components/Loading'

const DashboardLayout = ({children,} : Readonly<{children: React.ReactNode}>) => {
    const {user, loading, logout} = useAuth()

    const pathName = usePathname()

    const [open, setOpen] = useState(false)

    const navLinks = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            href: "/documents",
            label: "Documents",
            icon: FileText
        },
        {
            href: "/flashcards",
            label: "Flashcards",
            icon: BookOpen
        },
        {
            href: "/profile",
            label: "Profile",
            icon: User 
        }
    ]

    if (!loading && !user) {
        return null;
    }

if (loading) {
    return <Loading />
}

if (!user) {
    return null
}
return (
    <div>
        {/* Overlay */}
        {open && (
            <div className="fixed inset-0 bg-black/50 z-30 sm:hidden" onClick={() => setOpen(false)}/>
        )}
        
        <nav className="bg-background fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-default flex justify-between items-center">
            <Link href={"/dashboard"} className='hidden ms-2 items-center sm:flex' >
                <BrainCircuit className="gradient-primary me-3 p-1.5 rounded-lg shadow-sm shadow-primary/50" color="white" size={30}></BrainCircuit>
                <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">AI Learning Assistant</span>
            </Link>

            <div className="px-3 py-3 lg:px-5 lg:pl-3 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end ">
                        <span className="sr-only">Open sidebar</span>
                        <button onClick={() => setOpen(!open)} className="block sm:hidden cursor-pointer" aria-label="Sidebar">
                            <TextAlignJustify className="w-6 h-6"></TextAlignJustify>
                        </button>
                    </div>
                <div className="flex items-center">
                    <div className="flex items-center me-3">
                        <div className='flex items-center gap-2'>
                            {loading ? (
                                <>
                                    <Skeleton className='rounded-full h-10 w-10'></Skeleton>
                                    <div className=" w-28">
                                        <Skeleton className='rounded-full h-5 w-full mb-1'></Skeleton>
                                        <Skeleton className='rounded-full h-5 w-full'></Skeleton>
                                    </div>
                                </>
                            ) : (
                            <>
                                <Link href={"/profile"}>
                                    {user?.profile_img && 
                                        <Image src={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${user.profile_img}`} alt="Profile img" width={40} height={40} className="w-10 h-10 border-2 rounded-full" unoptimized></Image>
                                    }
                                </Link>
                                <div className='text-sm'>
                                    <h6>{user?.user_name}</h6>
                                    <p>{user?.email}</p>
                                </div>
                            </>
                            )
                            }
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </nav>

        <aside className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform sm:translate-x-0 bg-background ${open ? "translate-x-0": "-translate-x-full"}`}>
            <div className="min-h-[stretch] flex flex-col justify-between px-3 py-3 overflow-y-auto border-e border-default bg-background">
                <ul className=" space-y-2 mt-16 sm:mt-16 font-medium ">
                    {navLinks.map((link) => {
                        const Icon = link.icon
                        const isActive =
                        pathName === link.href ||
                        pathName.startsWith(`${link.href}/`)
                        return (
                            <li
                            key={link.href}
                            className={`button-base group ${
                                isActive
                                ? "main-button"
                                : "text-secondary-foreground hover:text-secondary-foreground"
                            }`}
                            >                                    
                                <Link href={link.href} onClick={() => setOpen(false)} className={`flex items-center`}>
                                    <Icon className="w-5 h-5" size={24}></Icon>
                                    <span className="ms-3">{link.label}</span>
                                </Link>
                            </li>
                        )
                    })}                
                </ul>
                <button className="flex items-center button-base text-errors border border-errors hover:shadow-sm group" onClick={logout}>
                    <LogOut className="w-5 h-5 transition duration-75 group-hover:text-fg-brand" size={24}></LogOut>
                    <span className="flex-1 ms-3 whitespace-nowrap text-start">Log out</span>
                </button>
            </div>
        </aside>

        <main>
            <div className="p-7 py-8 sm:ml-64 mt-14">
                {children}
            </div>
        </main>
    </div>
    )
}

export default DashboardLayout