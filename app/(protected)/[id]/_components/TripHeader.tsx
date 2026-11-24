import { ActionButton } from '@/components/ui/FormControls'
import { CheckCircle2, Compass, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function TripHeader({ tripId, id }: any) {
    return (
        <header className="h-14 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                    <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                    <h1 className="font-extrabold text-xs md:text-sm tracking-tight flex items-center gap-1.5">
                        Itinerary Creator Portal <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    </h1>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Trip ID:{' '}
                        <span className="font-mono text-blue-600 dark:text-blue-400">
                            {tripId.slice(0, 8)}...
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2.5">
                {/* {saveToast && (
                    <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {saveToast}
                    </span>
                )} */}
                <Link href={`/${id}/`} className="hidden md:inline-flex">
                    <ActionButton type="button" variant="secondary">
                        Dashboard
                    </ActionButton>
                </Link>
                <Link href={`/${id}/create-trip/`} className="hidden md:inline-flex">
                    <ActionButton type="button" variant="secondary">
                        All Trips
                    </ActionButton>
                </Link>
            </div>
        </header>
    )
}
