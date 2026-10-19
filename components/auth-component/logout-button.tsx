"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return <div
    onClick={logout}
    className="px-3 inline-flex items-center gap-2 cursor-pointer hover:text-red-600 transition-colors"
  >
    <span><LogOutIcon size={14} /></span> Logout
  </div>;
}
