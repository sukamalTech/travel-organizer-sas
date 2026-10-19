// // app/dashboard/[userId]/documents/page.tsx
// "use client";

// import { useState, useTransition } from "react";
// import { useParams } from "next/navigation";
// import { UploadButton } from "@/lib/uploadthing";
// import { saveDocumentMetadata, deleteDocument } from "../../../actions/documentactions";
// import { Eye, MessageCircle, Trash2, FileText, AlertTriangle } from "lucide-react";

// export default function DocumentsPage() {
//     const params = useParams();
//     const userId = params.id as string; // ✅ Fixed: Added 'userId' here

//     const [docName, setDocName] = useState("");
//     const [pendingUpload, setPendingUpload] = useState<{ url: string; key: string } | null>(null);
//     const [isPending, startTransition] = useTransition();

//     // Delete modal state
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedDoc, setSelectedDoc] = useState<{ id: string; fileKey: string; name: string } | null>(null);

//     // Mock initial documents list (In real app, fetch this server-side and pass as props)
//     const [docs, setDocs] = useState<any[]>([]);

//     const handleUploadComplete = async (res: any) => {
//         const file = res[0];
//         if (!docName.trim()) {
//             alert("Please provide a document name before uploading!");
//             return;
//         }

//         if (!userId) {
//             alert("User ID not found in URL parameters!");
//             return;
//         }

//         console.log("Submitting with userId:", userId);
//         startTransition(async () => {
//             const result = await saveDocumentMetadata(userId, docName, file.url, file.key);
//             if (result.success) {
//                 setDocName("");
//                 setPendingUpload(null);
//                 alert("Document uploaded successfully!");
//             } else {
//                 alert("Failed to save document metadata.");
//             }
//         });
//     };

//     const confirmAndDelete = async () => {
//         if (!selectedDoc || !userId) return;
//         startTransition(async () => {
//             const res = await deleteDocument(selectedDoc.id, selectedDoc.fileKey, userId);
//             if (res.success) {
//                 setDeleteModalOpen(false);
//                 setSelectedDoc(null);
//             } else {
//                 alert("Failed to delete the document.");
//             }
//         });
//     };

//     const shareOnWhatsApp = (name: string, url: string) => {
//         const text = encodeURIComponent(`Check out my important document: *${name}*\n${url}`);
//         window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
//     };

//     return (
//         <div className="max-w-5xl mx-auto p-6 space-y-8 min-h-screen text-zinc-900 dark:text-zinc-100">
//             {/* Header */}
//             <div>
//                 <h1 className="text-2xl font-bold tracking-tight">Manage Documents</h1>
//                 <p className="text-sm text-zinc-500 dark:text-zinc-400">
//                     Upload, view, and share your PDF and image files securely.
//                 </p>
//             </div>

//             {/* Upload Section */}
//             <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
//                 <h2 className="text-lg font-semibold">Upload New Document</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium mb-1">Document Name</label>
//                         <input
//                             type="text"
//                             placeholder="e.g. Tax Return 2025"
//                             value={docName}
//                             onChange={(e) => setDocName(e.target.value)}
//                             className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>
//                     <div className="flex flex-col justify-end">
//                         <UploadButton
//                             endpoint="documentUploader"
//                             onClientUploadComplete={handleUploadComplete}
//                             onUploadError={(error: Error) => {
//                                 alert(`ERROR! ${error.message}`);
//                             }}
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Document Grid */}
//             <div className="space-y-4">
//                 <h2 className="text-lg font-semibold">Your Documents</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {/* Example Card (Replace with mapped data from your DB query) */}
//                     <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
//                         <div className="flex items-start space-x-3">
//                             <FileText className="w-8 h-8 text-indigo-500 flex-shrink-0 mt-1" />
//                             <div className="overflow-hidden">
//                                 <h3 className="font-medium truncate">Sample Passport Scan.pdf</h3>
//                                 <p className="text-xs text-zinc-500 dark:text-zinc-400">Added on Oct 19, 2026</p>
//                             </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
//                             <a
//                                 href="#"
//                                 target="_blank"
//                                 rel="noreferrer"
//                                 className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
//                                 title="View"
//                             >
//                                 <Eye className="w-4 h-4" />
//                             </a>
//                             <button
//                                 onClick={() => shareOnWhatsApp("Sample Passport Scan.pdf", "#")}
//                                 className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition"
//                                 title="Share via WhatsApp"
//                             >
//                                 <MessageCircle className="w-4 h-4" />
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setSelectedDoc({ id: "1", fileKey: "sample-key", name: "Sample Passport Scan.pdf" });
//                                     setDeleteModalOpen(true);
//                                 }}
//                                 className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
//                                 title="Delete"
//                             >
//                                 <Trash2 className="w-4 h-4" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Delete Confirmation Modal */}
//             {deleteModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//                     <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-sm w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
//                         <div className="flex items-center space-x-3 text-rose-600">
//                             <AlertTriangle className="w-6 h-6" />
//                             <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Confirm Deletion</h3>
//                         </div>
//                         <p className="text-sm text-zinc-500 dark:text-zinc-400">
//                             Are you sure you want to delete <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedDoc?.name}</span>? This action cannot be undone.
//                         </p>
//                         <div className="flex space-x-3 pt-2">
//                             <button
//                                 type="button"
//                                 onClick={() => setDeleteModalOpen(false)}
//                                 className="flex-1 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="button"
//                                 disabled={isPending}
//                                 onClick={confirmAndDelete}
//                                 className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition disabled:opacity-50"
//                             >
//                                 {isPending ? "Deleting..." : "Delete"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// app/dashboard/[userId]/documents/page.tsx
export const instant = false
import { db } from "@/db"; // Adjust path to your Drizzle db instance
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import DocumentsClient from "./documentsClient";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Fetch documents for this user from TiDB
    const userDocs = await db
        .select()
        .from(documents)
        .where(eq(documents.userId, id));

    return <DocumentsClient userId={id} initialDocs={userDocs} />;
}