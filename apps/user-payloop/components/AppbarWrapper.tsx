"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Appbar } from "@repo/ui/appbar";

interface AppbarWrapperProps {
  user?: {
    name?: string | null;
  } | null;
}

export function AppbarWrapper({ user }: AppbarWrapperProps) {
  const router = useRouter();

  return (
    <Appbar
      user={user}
      onSignOut={() => {
        signOut({ callbackUrl: "/login" });
      }}
      onSignIn={() => {
        router.push("/login");
      }}
    />
  );
}
