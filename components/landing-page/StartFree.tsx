"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function StartFree() {
    // 1. Initialize state for userId (null means not logged in / loading)
    const [userId, setUserId] = useState<string | null>(null);

    // 2. Fetch user authentication status asynchronously on mount
    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id); // State updates -> component automatically re-renders
            }
        };

        fetchUser();
    }, []);

    // 3. Conditional rendering based on userId state
    return (
        <div>
            {userId ? (
                <Link
                    href={`/${userId}`}
                    className="px-3 py-1.5 rounded-sm font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/25"
                >
                    Dashboard
                </Link>
            ) : (
                <Link
                    href="/auth/sign-up"
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/25"
                >
                    Start Free
                </Link>
            )}
        </div>
    );
}