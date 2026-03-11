"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    await signOut({ redirect: true, redirectTo: "/login" });
  }

  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <Button onClick={handleLogout} disabled={isPending} variant="destructive">
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Logout"}
      </Button>
    </div>
  );
}
