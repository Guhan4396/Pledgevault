import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all active:scale-95 min-h-[44px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:   "bg-[#0F172A] text-white hover:bg-slate-700",
        secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
        danger:    "bg-red-600 text-white hover:bg-red-700",
        outline:   "border border-slate-200 text-slate-700 hover:bg-slate-50",
        ghost:     "text-slate-600 hover:bg-slate-100",
        loading:   "bg-blue-50 text-blue-500 cursor-wait pointer-events-none",
      },
      size: {
        sm: "px-3 py-1.5 text-xs min-h-[36px]",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-base",
        icon: "w-9 h-9 min-h-[36px] p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export function Button({ className, variant, size, loading, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant: loading ? "loading" : variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
