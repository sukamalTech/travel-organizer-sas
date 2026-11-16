// components/OfflineUserSync.tsx
"use client";

import { useEffect } from "react";

export default function OfflineUserSync({ userId }: { userId: string }) {
    useEffect(() => {
        if (userId) {
            localStorage.setItem("offline_active_user_id", userId);
        }
    }, [userId]);

    return null;
}