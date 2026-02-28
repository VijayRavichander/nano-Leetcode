import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none underline-offset-4",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-primary shadow-none hover:underline",
        destructive:
          "bg-transparent text-destructive shadow-none hover:underline",
        outline:
          "bg-transparent text-foreground shadow-none hover:underline",
        secondary:
          "bg-transparent text-muted-foreground shadow-none hover:text-foreground hover:underline",
        ghost:
          "bg-transparent text-muted-foreground shadow-none hover:text-foreground hover:underline",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto px-0 py-0",
        sm: "h-auto gap-1.5 px-0 py-0",
        lg: "h-auto px-0 py-0",
        icon: "size-auto p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
