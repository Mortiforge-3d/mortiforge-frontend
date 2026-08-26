import { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export default function Label({
  children,
  required = false,
  className = "",
  ...props
}: LabelProps) {
  return (
    <label
      className={`
        mb-2
        block
        body-font
        text-sm
        font-medium
        text-foreground
        ${className}
      `}
      {...props}
    >
      {children}

      {required && (
        <span className="ml-1 text-primary">
          *
        </span>
      )}
    </label>
  );
}