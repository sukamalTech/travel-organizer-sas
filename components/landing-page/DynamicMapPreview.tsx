// src/components/maps/DynamicMapPreview.tsx
// 'use client';

// import dynamic from 'next/dynamic';

// const MapCanvasWrapper = dynamic(
//     () => import('./MapCanvasWrapper'),
//     {
//         ssr: false,
//         loading: () => (
//             <div className="w-full h-full min-h-[400px] bg-surface/40 animate-pulse rounded-xl border border-border flex flex-col items-center justify-center text-text-muted gap-2">
//                 <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
//                 <span className="text-sm font-medium">Initializing Interactive Google Map...</span>
//             </div>
//         )
//     }
// );

// export function DynamicMapPreview({ activeDay }: { activeDay: number }) {
//     return (
//         <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden glass-panel relative">
//             <MapCanvasWrapper activeDay={activeDay} />
//         </div>
//     );
// }

import React from 'react'

export default function DynamicMapPreview() {
    return (
        <div>
            hello
        </div>
    )
}
