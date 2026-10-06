import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Derive the user ID from the claims (typically 'sub' in JWT claims)
  // Adjust if your user ID is stored elsewhere in your claims object
  const userId = user?.sub;

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm">Hey, {user.email}!</span>

      {/* Dashboard Button */}
      {userId && (
        <Button asChild size="sm" variant={"outline"}>
          <Link href={`/${userId}`}>Dashboard</Link>
        </Button>
      )}

      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}