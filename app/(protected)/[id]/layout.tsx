// 

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, LayoutDashboard, LogOut } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Top Navigation */}
            <header className="border-b bg-white dark:bg-slate-900 dark:border-slate-800">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center space-x-6">
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            App Portal
                        </span>
                        <nav className="flex space-x-4">
                            <Link
                                href={`/${id}`}
                                className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href={`/${id}/profile`}
                                className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <User className="h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </nav>
                    </div>

                    <form >
                        <button
                            type="submit"
                            className="flex items-center space-x-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                            {/* <LogoutButton /> */}

                        </button>
                    </form>
                </div>
            </header>

            {/* Main Container */}
            <main className="container mx-auto max-w-5xl py-8 px-4">{children}</main>
        </div>
    )
}