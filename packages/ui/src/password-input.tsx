"use client";

import { forwardRef, useState } from "react";

import { cn } from "./cn";
import { EyeIcon, EyeOffIcon } from "./icons";
import { TextInput, type TextInputProps } from "./text-input";

export type PasswordInputProps = TextInputProps;

/**
 * Password field with a visibility toggle. The toggle is a real button so it
 * is reachable by keyboard and announced correctly.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ suffix, className, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <TextInput
        ref={ref}
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        className={cn("pr-10 font-normal", className)}
        suffix={
          suffix ?? (
            <button
              type="button"
              onClick={() => setVisible((value) => !value)}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              className="flex size-7 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-surface-hover hover:text-fg-muted"
            >
              {visible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          )
        }
        {...props}
      />
    );
  },
);