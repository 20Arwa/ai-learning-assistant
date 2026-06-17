"use client"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Lock, Eye, EyeOff } from "lucide-react"

function InputPassword(
    { className, error: error, ...props }: 
    React.ComponentProps<"input"> & {
        error?: string | undefined
    }
) {
    const [showPass, setShowPass] = useState(false)

    return (
        <div>
            <div className={`group flex items-center justify-between mt-1 p-1.5 py-1 border-2 rounded-lg ${error ? "border-red-400" : "border-border"}`}>

            <div className="flex items-center gap-x-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <input
                    type={showPass? "text" : "password"}
                    className={cn("w-full focus-within:outline-0", className)}
                    {...props}
                />
            </div>   

            <button type="button" onClick={() => setShowPass(!showPass)} className=" text-muted-foreground cursor-pointer">
                {showPass? 
                    <Eye className="w-5 h-5" aria-label="Show password"></Eye>    
                    :<EyeOff className="w-5 h-5" aria-label="Hide password"></EyeOff>
                }
            </button>
            
            </div>
            {error && (<p className="text-sm text-errors">{error}</p>)}
        </div>
    )
}


export { InputPassword }
