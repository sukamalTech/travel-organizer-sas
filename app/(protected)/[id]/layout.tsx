

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import Header from '@/components/dashboards/mobileHeader'

// Prevents Next.js 16 build error by allowing dynamic request execution during SSR
export const instant = false

export default async function ProtectedLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    // Ensure users can only view their own dashboard/profile
    if (user.id !== id) {
        redirect(`/${user.id}/profile`)
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            {/* Top Navigation */}
            <Header userId={user.id} />

            {/* Main Container */}
            <main className="container mx-auto max-w-5xl py-8 px-4">{children}</main>
        </div>
    )
}