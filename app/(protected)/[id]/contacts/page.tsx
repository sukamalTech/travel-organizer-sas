// app/(protected)/[id]/contacts/page.tsx
import { Suspense } from "react";
import OfflineContactManager from "@/components/contacts/OfflineContactManager";

export const metadata = {
    title: "Contacts Directory",
    description: "Offline-ready travel and official contacts with Voice & WhatsApp calling",
};

export default function ContactsPage() {
    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <Suspense
                fallback={
                    <div className="max-w-md mx-auto p-4 text-sm text-gray-500">
                        Loading contacts directory...
                    </div>
                }
            >
                <OfflineContactManager />
            </Suspense>
        </main>
    );
}