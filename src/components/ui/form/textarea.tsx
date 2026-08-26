import { forwardRef, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          min-h-32
          w-full
          resize-y
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

Textarea.displayName = "Textarea";

export default Textarea;