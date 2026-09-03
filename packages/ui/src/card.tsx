import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">{children}</div>
  );
}
