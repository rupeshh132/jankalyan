import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-3 w-3",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const Spinner = React.forwardRef(({ className, size, ...props }, ref) => {
  return (
    <Loader2
      ref={ref}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  )
})
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }
