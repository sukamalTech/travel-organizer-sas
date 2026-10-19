// app/actions/document-actions.ts
"use server";

import { db } from "@/db"; // Adjust this to point to your Drizzle db instance
import { documents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { revalidatePath } from "next/cache";

const utapi = new UTApi();

export async function saveDocumentMetadata(
  userId: string,
  name: string,
  fileUrl: string,
  fileKey: string,
) {
  console.log("RECEIVE DATA -> userId:", userId, "name:", name); // <--- Add this line

  if (!userId) {
    return { success: false, error: "User ID is missing!" };
  }
  try {
    const id = crypto.randomUUID();
    await db.insert(documents).values({
      id,
      userId,
      name,
      fileUrl,
      fileKey,
    });
    revalidatePath(`/${userId}/documents`);
    return { success: true };
  } catch (error) {
    console.error("Failed to save document:", error);
    return { success: false, error: "Database save failed" };
  }
}

export async function deleteDocument(
  documentId: string,
  fileKey: string,
  userId: string,
) {
  try {
    // 1. Delete file from Uploadthing storage
    await utapi.deleteFiles(fileKey);

    // 2. Delete metadata from TiDB
    await db
      .delete(documents)
      .where(and(eq(documents.id, documentId), eq(documents.userId, userId)));

    revalidatePath(`/${userId}/documents`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete document:", error);
    return { success: false, error: "Deletion failed" };
  }
}
