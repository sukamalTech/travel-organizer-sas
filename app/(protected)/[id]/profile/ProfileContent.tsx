import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function ProfileContent({
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
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                        <AvatarFallback>{user?.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{user?.user_metadata?.full_name || 'User Profile'}</CardTitle>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}