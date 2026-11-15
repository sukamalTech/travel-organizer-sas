// lib/offlineContactsDB.ts
export type TagItem = {
  id: string;
  name: string;
  is_default?: boolean;
  contact_count?: number;
};

export type ContactItem = {
  id: string;
  name: string;
  phone_number: string;
  notes?: string | null;
  tags: { id: string; name: string }[];
};

const DB_NAME = "travel_contacts_offline_v1";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("SSR");
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("tags")) {
        db.createObjectStore("tags", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("contacts")) {
        db.createObjectStore("contacts", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save fresh server data into IndexedDB
export async function cacheContactsData(
  tags: TagItem[],
  contacts: ContactItem[],
) {
  try {
    const db = await openDB();
    const tx = db.transaction(["tags", "contacts"], "readwrite");

    const tagStore = tx.objectStore("tags");
    const contactStore = tx.objectStore("contacts");

    tagStore.clear();
    contactStore.clear();

    tags.forEach((tag) => tagStore.put(tag));
    contacts.forEach((contact) => contactStore.put(contact));

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB cache write failed:", err);
  }
}

// Read cached tags and contacts when offline or before network responds
export async function getOfflineContactsData(): Promise<{
  tags: TagItem[];
  contacts: ContactItem[];
}> {
  try {
    const db = await openDB();
    const tx = db.transaction(["tags", "contacts"], "readonly");

    const tagsReq = tx.objectStore("tags").getAll();
    const contactsReq = tx.objectStore("contacts").getAll();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        resolve({
          tags: tagsReq.result || [],
          contacts: contactsReq.result || [],
        });
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return { tags: [], contacts: [] };
  }
}
