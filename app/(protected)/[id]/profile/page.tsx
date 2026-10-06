

import { createClient } from '@/lib/supabase/server'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Mail, ShieldCheck, UserCheck, Key, Fingerprint } from 'lucide-react'

// Prevents Next.js 16 build error by allowing dynamic request execution during SSR
export const instant = false

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const email = user?.email || 'N/A'
    const initials = email.substring(0, 2).toUpperCase()
    const createdAt = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Unknown'

    const lastSignIn = user?.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
        : 'N/A'

    return (
        <div className="space-y-6">
            {/* Header Profile Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20 border-2 border-slate-200 dark:border-slate-700">
                        <AvatarImage
                            src={user?.user_metadata?.avatar_url || ''}
                            alt="User Avatar"
                        />
                        <AvatarFallback className="text-xl font-semibold bg-slate-200 dark:bg-slate-800">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {user?.user_metadata?.full_name || 'User Profile'}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {email}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400">
                                <ShieldCheck className="mr-1 h-3 w-3" /> Active Session
                            </Badge>
                            <Badge variant="secondary">
                                Role: {user?.role || 'authenticated'}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Details & Metadata Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-slate-500" />
                            Account Details
                        </CardTitle>
                        <CardDescription>
                            Basic information associated with your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                <Mail className="h-4 w-4" />
                                <span>Email Address</span>
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {email}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                <Calendar className="h-4 w-4" />
                                <span>Account Created</span>
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {createdAt}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                <Key className="h-4 w-4" />
                                <span>Last Sign In</span>
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {lastSignIn}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Fingerprint className="h-5 w-5 text-slate-500" />
                            Security & Identifiers
                        </CardTitle>
                        <CardDescription>
                            System credentials and authentication details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                User ID (UUID)
                            </span>
                            <p className="rounded-md bg-slate-100 dark:bg-slate-800 p-2.5 font-mono text-xs text-slate-800 dark:text-slate-200 break-all">
                                {id}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                Auth Provider
                            </span>
                            <p className="rounded-md bg-slate-100 dark:bg-slate-800 p-2.5 font-mono text-xs text-slate-800 dark:text-slate-200">
                                {user?.app_metadata?.provider || 'Email / Password'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Raw Session Object */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-500">
                        Raw User Session Object
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="max-h-60 overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-100">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}