
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("px-4 py-2 bg-blue-600 text-white rounded", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
