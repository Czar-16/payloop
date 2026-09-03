import React from "react";

interface AppbarProps {
  user?: {
    name: string;
  };
}

export function Appbar({ user }: AppbarProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-bold">Payloop</h1>

      {user && <span className="text-sm font-medium">{user.name}</span>}
    </header>
  );
}
