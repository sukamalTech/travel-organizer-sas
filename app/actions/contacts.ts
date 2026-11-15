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

// Helper: Normalize Indian 10-digit numbers to +91
function normalizePhoneNumber(rawPhone: string): string {
  const cleaned = rawPhone.replace(/[\s\-()]/g, "");
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  return cleaned;
}

// 1. Ensure default tags exist for the user, then fetch all tags with contact counts
export async function getUserTagsWithCounts() {
  const userId = await getAuthenticatedUserId();

  // Seed default tags if user has zero tags yet
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

  // Fetch all tags with contact count using LEFT JOIN
  const rows = await db
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

  return rows;
}

// 2. Create a custom tag (e.g., "DFPD Officials", "DCFS", "SCFS")
export async function createCustomTag(tagName: string) {
  const userId = await getAuthenticatedUserId();
  const trimmedName = tagName.trim();

  if (!trimmedName) {
    throw new Error("Tag name cannot be empty");
  }

  // Return existing tag if user already created one with the same name
  const existing = await db
    .select({ id: contactTags.id, name: contactTags.name })
    .from(contactTags)
    .where(
      and(eq(contactTags.userId, userId), eq(contactTags.name, trimmedName)),
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const tagId = globalThis.crypto.randomUUID();
  await db.insert(contactTags).values({
    id: tagId,
    userId,
    name: trimmedName,
    isDefault: false,
  });

  return { id: tagId, name: trimmedName };
}

// 3. Save a new contact with multiple tags inside a Drizzle transaction
export async function saveContactWithTags(data: {
  name: string;
  phone: string;
  tagIds: string[];
  notes?: string;
}) {
  const userId = await getAuthenticatedUserId();

  if (!data.tagIds || data.tagIds.length === 0) {
    throw new Error("Select at least one tag");
  }

  const contactId = globalThis.crypto.randomUUID();
  const cleanPhone = normalizePhoneNumber(data.phone);

  await db.transaction(async (tx) => {
    // Insert contact
    await tx.insert(userContacts).values({
      id: contactId,
      userId,
      name: data.name.trim(),
      phoneNumber: cleanPhone,
      notes: data.notes?.trim() || null,
    });

    // Verify submitted tagIds belong to this user
    const validTags = await tx
      .select({ id: contactTags.id })
      .from(contactTags)
      .where(
        and(
          eq(contactTags.userId, userId),
          inArray(contactTags.id, data.tagIds),
        ),
      );

    if (validTags.length === 0) {
      throw new Error("No valid tags selected");
    }

    // Batch insert tag mappings
    await tx.insert(contactTagMap).values(
      validTags.map((tag) => ({
        contactId,
        tagId: tag.id,
      })),
    );
  });

  return { success: true, contactId };
}

// 4. Update tags on an existing contact
export async function updateContactTags(
  contactId: string,
  newTagIds: string[],
) {
  const userId = await getAuthenticatedUserId();

  if (!newTagIds || newTagIds.length === 0) {
    throw new Error("Contact must have at least one tag");
  }

  // Verify ownership of the contact
  const contact = await db
    .select({ id: userContacts.id })
    .from(userContacts)
    .where(and(eq(userContacts.id, contactId), eq(userContacts.userId, userId)))
    .limit(1);

  if (contact.length === 0) {
    throw new Error("Contact not found");
  }

  await db.transaction(async (tx) => {
    await tx
      .delete(contactTagMap)
      .where(eq(contactTagMap.contactId, contactId));

    const validTags = await tx
      .select({ id: contactTags.id })
      .from(contactTags)
      .where(
        and(eq(contactTags.userId, userId), inArray(contactTags.id, newTagIds)),
      );

    if (validTags.length > 0) {
      await tx.insert(contactTagMap).values(
        validTags.map((tag) => ({
          contactId,
          tagId: tag.id,
        })),
      );
    }
  });

  return { success: true };
}

// 5. Fetch contacts with all their assigned tags attached
export async function getMultiTagContacts(
  filterTagId?: string,
  searchQuery?: string,
) {
  const userId = await getAuthenticatedUserId();

  const conditions = [eq(userContacts.userId, userId)];

  // Filter by specific tag while preserving all tags on matching contacts
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

  // Optional search filter across name, phone number, and notes
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
    )
    .orderBy(asc(userContacts.name));

  return rows;
}

// 6. Delete a contact
export async function deleteContact(contactId: string) {
  const userId = await getAuthenticatedUserId();

  await db
    .delete(userContacts)
    .where(
      and(eq(userContacts.id, contactId), eq(userContacts.userId, userId)),
    );

  return { success: true };
}
