import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  const isError = error || props["aria-invalid"] === "true";

  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
        isError && "border-destructive focus-visible:ring-destructive focus-visible:ring-4 focus-visible:ring-destructive/20 text-destructive placeholder:text-destructive/50 hover:border-destructive/50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
