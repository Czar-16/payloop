import {
  forwardRef,
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

import { cn } from "./cn";
import { Field, controlClasses } from "./field";
import { ChevronDownIcon } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: ReactNode;
  options: SelectOption[];
  hint?: ReactNode;
  error?: string | null;
  /** Small trailing affordance aligned with the label row. */
  action?: ReactNode;
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      options,
      hint,
      error,
      action,
      placeholder,
      required,
      containerClassName,
      className,
      id,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const describedBy = error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined;

    return (
      <Field
        label={label}
        htmlFor={selectId}
        hint={hint}
        error={error}
        required={required}
        action={action}
        className={containerClassName}
      >
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              controlClasses(Boolean(error)),
              "h-9.5 cursor-pointer appearance-none py-0 pr-9 pl-3",
              className,
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDownIcon
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 my-auto h-full text-fg-subtle"
          />
        </div>
      </Field>
    );
  },
);