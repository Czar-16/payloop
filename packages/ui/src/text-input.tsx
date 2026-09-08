import React from "react";

interface TextInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TextInput({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-md border px-3 py-2 outline-none focus:ring-2"
      />
    </div>
  );
}
