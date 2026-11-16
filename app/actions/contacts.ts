// app/actions/contacts.ts
"use server";

import { eq, and, inArray, like, or, desc, asc, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { contactTags, userContacts, contactTagMap } from "@/db/schema";

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return user.id;
}

function normalizePhoneNumber(rawPhone: string): string {
  const cleaned = rawPhone.replace(/[\s\-()]/g, "");
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  return cleaned;
}

// 1. Fetch all tags with contact counts (seeding defaults on first run)
export async function getUserTagsWithCounts() {
  const userId = await getAuthenticatedUserId();

  const existingTags = await db
    .select({ id: contactTags.id })
    .from(contactTags)
    .where(eq(contactTags.userId, userId))
    .limit(1);

  if (existingTags.length === 0) {
    const defaults = ["Friends", "Family", "Work", "Emergency"];
    await db
      .insert(contactTags)
      .ignore()
      .values(
        defaults.map((name) => ({
          id: globalThis.crypto.randomUUID(),
          userId,
          name,
          isDefault: true,
        })),
      );
  }

  return await db
    .select({
      id: contactTags.id,
      name: contactTags.name,
      is_default: contactTags.isDefault,
      contact_count: sql<number>`CAST(COUNT(${contactTagMap.contactId}) AS UNSIGNED)`,
    })
    .from(contactTags)
    .leftJoin(contactTagMap, eq(contactTags.id, contactTagMap.tagId))
    .where(eq(contactTags.userId, userId))
    .groupBy(contactTags.id, contactTags.name, contactTags.isDefault)
    .orderBy(desc(contactTags.isDefault), asc(contactTags.name));
}

// 2. Create a custom tag
export async function createCustomTag(tagName: string) {
  const userId = await getAuthenticatedUserId();
  const trimmedName = tagName.trim();

  if (!trimmedName) throw new Error("Tag name cannot be empty");

  const existing = await db
    .select({
      id: contactTags.id,
      name: contactTags.name,
      is_default: contactTags.isDefault,
    })
    .from(contactTags)
    .where(
      and(eq(contactTags.userId, userId), eq(contactTags.name, trimmedName)),
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  const tagId = globalThis.crypto.randomUUID();
  await db.insert(contactTags).values({
    id: tagId,
    userId,
    name: trimmedName,
    isDefault: false,
  });

  return { id: tagId, name: trimmedName, is_default: false };
}

// 3. Rename a custom tag (default tags are protected)
export async function renameCustomTag(tagId: string, newName: string) {
  const userId = await getAuthenticatedUserId();
  const trimmed = newName.trim();
  if (!trimmed) throw new Error("Tag name cannot be empty");

  const tag = await db
    .select({ id: contactTags.id, isDefault: contactTags.isDefault })
    .from(contactTags)
    .where(and(eq(contactTags.id, tagId), eq(contactTags.userId, userId)))
    .limit(1);

  if (tag.length === 0) throw new Error("Tag not found");
  if (tag[0].isDefault) throw new Error("Default tags cannot be renamed");

  await db
    .update(contactTags)
    .set({ name: trimmed })
    .where(and(eq(contactTags.id, tagId), eq(contactTags.userId, userId)));

  return { success: true, id: tagId, name: trimmed };
}

// 4. Delete a custom tag (default tags are protected)
export async function deleteCustomTag(tagId: string) {
  const userId = await getAuthenticatedUserId();

  const tag = await db
    .select({ id: contactTags.id, isDefault: contactTags.isDefault })
    .from(contactTags)
    .where(and(eq(contactTags.id, tagId), eq(contactTags.userId, userId)))
    .limit(1);

  if (tag.length === 0) throw new Error("Tag not found");
  if (tag[0].isDefault) throw new Error("Default tags cannot be deleted");

  await db
    .delete(contactTags)
    .where(and(eq(contactTags.id, tagId), eq(contactTags.userId, userId)));

  return { success: true };
}

// 5. Save a new contact (TiDB HTTP-driver safe)
export async function saveContactWithTags(data: {
  name: string;
  phone: string;
  tagIds: string[];
  notes?: string;
  isFrequent?: boolean;
}) {
  const userId = await getAuthenticatedUserId();

  if (!data.tagIds || data.tagIds.length === 0) {
    throw new Error("Select at least one tag");
  }

  const validTags = await db
    .select({ id: contactTags.id })
    .from(contactTags)
    .where(
      and(eq(contactTags.userId, userId), inArray(contactTags.id, data.tagIds)),
    );

  if (validTags.length === 0) {
    throw new Error("No valid tags selected");
  }

  const contactId = globalThis.crypto.randomUUID();
  const cleanPhone = normalizePhoneNumber(data.phone);

  await db.insert(userContacts).values({
    id: contactId,
    userId,
    name: data.name.trim(),
    phoneNumber: cleanPhone,
    notes: data.notes?.trim() || null,
    isFrequent: Boolean(data.isFrequent),
  });

  await db.insert(contactTagMap).values(
    validTags.map((tag) => ({
      contactId,
      tagId: tag.id,
    })),
  );

  return { success: true, contactId, phone_number: cleanPhone };
}

// 6. Update an existing contact (TiDB HTTP-driver safe)
export async function updateContact(
  contactId: string,
  data: {
    name: string;
    phone: string;
    tagIds: string[];
    notes?: string;
    isFrequent?: boolean;
  },
) {
  const userId = await getAuthenticatedUserId();

  if (!data.tagIds || data.tagIds.length === 0) {
    throw new Error("Contact must have at least one tag");
  }

  const existing = await db
    .select({ id: userContacts.id })
    .from(userContacts)
    .where(and(eq(userContacts.id, contactId), eq(userContacts.userId, userId)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Contact not found");
  }

  const validTags = await db
    .select({ id: contactTags.id })
    .from(contactTags)
    .where(
      and(eq(contactTags.userId, userId), inArray(contactTags.id, data.tagIds)),
    );

  if (validTags.length === 0) {
    throw new Error("No valid tags selected");
  }

  const cleanPhone = normalizePhoneNumber(data.phone);

  // Update contact details
  await db
    .update(userContacts)
    .set({
      name: data.name.trim(),
      phoneNumber: cleanPhone,
      notes: data.notes?.trim() || null,
      isFrequent: Boolean(data.isFrequent),
    })
    .where(
      and(eq(userContacts.id, contactId), eq(userContacts.userId, userId)),
    );

  // Replace tag mappings
  await db.delete(contactTagMap).where(eq(contactTagMap.contactId, contactId));

  await db.insert(contactTagMap).values(
    validTags.map((tag) => ({
      contactId,
      tagId: tag.id,
    })),
  );

  return { success: true, phone_number: cleanPhone };
}

// 7. Fetch all contacts with their assigned tags
export async function getMultiTagContacts(
  filterTagId?: string,
  searchQuery?: string,
) {
  const userId = await getAuthenticatedUserId();

  const conditions = [eq(userContacts.userId, userId)];

  if (filterTagId && filterTagId !== "ALL") {
    conditions.push(
      inArray(
        userContacts.id,
        db
          .select({ contactId: contactTagMap.contactId })
          .from(contactTagMap)
          .where(eq(contactTagMap.tagId, filterTagId)),
      ),
    );
  }

  if (searchQuery && searchQuery.trim() !== "") {
    const term = `%${searchQuery.trim()}%`;
    conditions.push(
      or(
        like(userContacts.name, term),
        like(userContacts.phoneNumber, term),
        like(userContacts.notes, term),
      )!,
    );
  }

  const rows = await db
    .select({
      id: userContacts.id,
      name: userContacts.name,
      phone_number: userContacts.phoneNumber,
      notes: userContacts.notes,
      is_frequent: userContacts.isFrequent,
      tags: sql<{ id: string; name: string }[]>`JSON_ARRAYAGG(
        JSON_OBJECT('id', ${contactTags.id}, 'name', ${contactTags.name})
      )`,
    })
    .from(userContacts)
    .innerJoin(contactTagMap, eq(userContacts.id, contactTagMap.contactId))
    .innerJoin(contactTags, eq(contactTagMap.tagId, contactTags.id))
    .where(and(...conditions))
    .groupBy(
      userContacts.id,
      userContacts.name,
      userContacts.phoneNumber,
      userContacts.notes,
      userContacts.isFrequent,
    )
    .orderBy(asc(userContacts.name));

  return rows.map((row) => ({
    ...row,
    is_frequent: Boolean(row.is_frequent),
    tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
  }));
}

// 8. Delete a contact
export async function deleteContact(contactId: string) {
  const userId = await getAuthenticatedUserId();

  await db
    .delete(userContacts)
    .where(
      and(eq(userContacts.id, contactId), eq(userContacts.userId, userId)),
    );

  return { success: true };
}
