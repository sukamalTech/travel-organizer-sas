// // export const dynamic = 'force-dynamic'
// import { createClient } from '@/lib/supabase/server'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import Link from 'next/link'
// import { User, ArrowRight } from 'lucide-react'

// export default async function UserDashboard({
//     params,
// }: {
//     params: Promise<{ id: string }>
// }) {
//     const { id } = await params
//     const supabase = await createClient()
//     const {
//         data: { user },
//     } = await supabase.auth.getUser()

//     return (
//         <div className="space-y-6">
//             <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
//                 <h1 className="text-2xl font-bold">Welcome back, {user?.email}!</h1>
//                 <p className="text-slate-500 mt-1">
//                     This is your personalized dashboard dashboard context.
//                 </p>
//             </div>

//             <div className="grid gap-6 md:grid-cols-2">
//                 <Card className="hover:border-slate-400 transition-all">
//                     <CardHeader>
//                         <CardTitle className="flex items-center justify-between">
//                             <span>View Profile</span>
//                             <User className="h-5 w-5 text-slate-500" />
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <p className="text-sm text-slate-500">
//                             Manage your user metadata, security settings, and session credentials.
//                         </p>
//                         <Link
//                             href={`/${id}/profile`}
//                             className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
//                         >
//                             <span>Go to Profile</span>
//                             <ArrowRight className="h-4 w-4" />
//                         </Link>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { User, ArrowRight } from 'lucide-react'

// Prevents Next.js 16 build error by allowing dynamic request execution during SSR
export const instant = false

export default async function UserDashboard({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <h1 className="text-2xl font-bold">Welcome back, {user?.email}!</h1>
                <p className="text-slate-500 mt-1">
                    This is your personal dashboard context.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover:border-slate-400 transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>View Profile</span>
                            <User className="h-5 w-5 text-slate-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-500">
                            Manage your user metadata, security settings, and session credentials.
                        </p>
                        <Link
                            href={`/${id}/profile`}
                            className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                            <span>Go to Profile</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}