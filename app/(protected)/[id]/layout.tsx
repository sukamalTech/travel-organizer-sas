
// export const instant = false

// import { createClient } from '@/lib/supabase/server'
// import { redirect } from 'next/navigation'

// import Header from '@/components/dashboards/mobileHeader'

// // Prevents Next.js 16 build error by allowing dynamic request execution during SSR

// export default async function ProtectedLayout({
//     children,
//     params,
// }: {
//     children: React.ReactNode
//     params: Promise<{ id: string }>
// }) {
//     const { id } = await params
//     const supabase = await createClient()

//     const {
//         data: { user },
//     } = await supabase.auth.getUser()

//     if (!user) {
//         redirect('/')
//     }

//     // Ensure users can only view their own dashboard/profile
//     if (user.id !== id) {
//         redirect(`/${user.id}/profile`)
//     }

//     return (
//         <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
//             {/* Top Navigation */}
//             <Header userId={user.id} />

//             {/* Main Container */}
//             <main className="container mx-auto max-w-5xl py-8 px-4">{children}</main>
//         </div>
//     )
// }


// app/(protected)/[id]/layout.tsx
export const instant = false;

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/dashboards/mobileHeader";
import OfflineUserSync from "@/components/OfflineUserSync";

// Prevents Next.js 16 build error by allowing dynamic request execution during SSR

export default async function ProtectedLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let activeUserId = id;

    try {
        const supabase = await createClient();
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        // Only redirect if we received a valid online response confirming no user
        if (!error && !user) {
            redirect("/");
        }

        if (user) {
            // Ensure users can only view their own dashboard/profile
            if (user.id !== id) {
                redirect(`/${user.id}/profile`);
            }
            activeUserId = user.id;
        }
    } catch (err: any) {
        // Re-throw Next.js redirect errors so redirects still work normally
        if (err?.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        // Offline / network failure: allow cached route shell to render with route `id`
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            {/* Persist active userId in localStorage for offline landing page navigation */}
            <OfflineUserSync userId={activeUserId} />

            {/* Top Navigation */}
            <Header userId={activeUserId} />

            {/* Main Container */}
            <main className="container  max-w-full py-8 px-4">{children}</main>
        </div>
    );
}