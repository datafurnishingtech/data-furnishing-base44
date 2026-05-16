import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-6 items-center rounded-full border px-2.5 py-0 text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring/20 focus:ring-offset-0",
  {
    variants: {
      variant: {
        default:
          "border-[#DCD5FF] bg-accent text-accent-foreground hover:bg-accent",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary",
        destructive:
          "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
        outline: "border-border bg-card text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }