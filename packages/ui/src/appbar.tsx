import React from "react";

interface AppbarProps {
  user?: {
    name?: string | null;
  } | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

export function Appbar({ user, onSignOut, onSignIn }: AppbarProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <a href="/" className="text-xl font-bold">
        Payloop
      </a>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium">{user.name || "User"}</span>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
              >
                Sign Out
              </button>
            )}
          </>
        ) : (
          onSignIn && (
            <button
              onClick={onSignIn}
              className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
            >
              Sign In
            </button>
          )
        )}
      </div>
    </header>
  );
}
