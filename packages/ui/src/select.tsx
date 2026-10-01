import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  name?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({ label, name, options, value, onChange }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-md border px-3 py-2 outline-none focus:ring-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
