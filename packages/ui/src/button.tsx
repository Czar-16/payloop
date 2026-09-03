import React from "react";

interface ButtonProps {
  children: React.ReactNode; // whatever you want to put inside the button eg ; click me
  onclick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({ children, onclick, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onclick}
      className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
    >
      {children}
    </button>
  );
}
