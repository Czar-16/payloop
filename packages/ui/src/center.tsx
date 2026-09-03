import React from "react";

interface CenterProps {
  children: React.ReactNode;
}

export function Center({ children }: CenterProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
}
