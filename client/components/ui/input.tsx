import * as React from "react"

import { cn } from "@/lib/utils"
import { error } from "console"

function Input(
  { className, type, icon: Icon, error: error, ...props }: 
  React.ComponentProps<"input"> & {
    icon?: React.ComponentType<{ className?: string }>
    error?: string | undefined
  }
) {
  return (
    <div>
      <div className={`group flex items-center gap-x-2 mt-1 p-1.5 py-1 border-2 rounded-md ${error ? "border-red-400" : "border-border"}`}>
        {Icon && (
          <Icon className="w-5 h-5 text-muted-foreground" />
        )}

        <input
          type={type}
          className={cn("w-full focus-within:outline-0", className)}
          {...props}
        />

      </div>
      {error && (<p className="text-sm text-errors">{error}</p>)}

    </div>
  )
}

export { Input }
