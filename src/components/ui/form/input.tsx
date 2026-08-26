import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full
          rounded-xl
          border
          border-border
          bg-card
          px-5
          py-4
          body-font
          text-sm
          transition-all
          duration-300
          outline-none
          placeholder:text-muted-foreground
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;