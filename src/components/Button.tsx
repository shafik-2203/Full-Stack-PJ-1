
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
          // Variants
          {
            "bg-primary-500 text-white hover:bg-primary-600":
              variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200":
              variant === "secondary",
            "hover:bg-gray-100": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
          },
          // Sizes
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4": size === "md",
            "h-12 px-6 text-lg": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };