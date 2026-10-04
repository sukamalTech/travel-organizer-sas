import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Prevents build-time prerender error by marking the redirect as dynamic
export const instant = false

export default async function DashboardRedirect() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Redirect to user-specific dashboard ID
    redirect(`/${user.id}`)
}



