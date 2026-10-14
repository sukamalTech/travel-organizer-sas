// lib/db.ts
import { get, set, del, clear } from "idb-keyval";

export async function saveOfflineData(key: string, value: any) {
  if (typeof window === "undefined") return;
  try {
    await set(key, value);
  } catch (error) {
    console.error("IndexedDB save failed:", error);
  }
}

export async function getOfflineData(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return await get(key);
  } catch (error) {
    console.error("IndexedDB read failed:", error);
    return null;
  }
}

export async function removeOfflineData(key: string) {
  if (typeof window === "undefined") return;
  try {
    await del(key);
  } catch (error) {
    console.error("IndexedDB delete failed:", error);
  }
}
