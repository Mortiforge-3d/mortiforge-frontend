import { ReactNode } from "react";
import Label from "./label";

type FieldProps = {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export default function Field({
  label,
  required = false,
  error,
  hint,
  children,
}: FieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}

      {children}

      {hint && !error && (
        <p className="body-font text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      {error && (
        <p className="body-font text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}