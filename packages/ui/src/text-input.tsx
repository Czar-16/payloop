import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "./cn";
import { Field, controlClasses } from "./field";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  /** Renders inside the field, before the text — e.g. a `₹` symbol. */
  prefix?: ReactNode;
  /** Renders inside the field, at the end — e.g. a show/hide toggle. */
  suffix?: ReactNode;
  containerClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      label,
      hint,
      error,
      prefix,
      suffix,
      required,
      containerClassName,
      className,
      id,
      type = "text",
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <Field
        label={label}
        htmlFor={inputId}
        hint={hint}
        error={error}
        required={required}
        className={containerClassName}
      >
        <div className="relative">
          {prefix ? (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-fg-subtle">
              {prefix}
            </span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            type={type}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              controlClasses(Boolean(error)),
              "h-9.5 px-3",
              prefix && "pl-8",
              suffix && "pr-10",
              className,
            )}
            {...props}
          />

          {suffix ? (
            <span className="absolute inset-y-0 right-0 flex items-center pr-1.5">
              {suffix}
            </span>
          ) : null}
        </div>
      </Field>
    );
  },
);