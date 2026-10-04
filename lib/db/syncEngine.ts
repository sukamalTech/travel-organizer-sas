// src/lib/db/syncEngine.ts
import { db } from "./offlineStore";
import { createClient } from "@/lib/supabase/client";

export async function queueOfflineMutation(
  tableName: string,
  operation: "INSERT" | "UPDATE" | "DELETE",
  recordId: string,
  payload: any,
) {
  if (tableName === "trips") {
    await db.trips.put({
      id: recordId,
      owner_id: payload.owner_id,
      title: payload.title,
      start_date: payload.start_date,
      end_date: payload.end_date,
      primary_mode: payload.primary_mode,
      payload,
      sync_status: operation === "INSERT" ? "created" : "updated",
      updated_at: Date.now(),
    });
  }

  await db.syncQueue.add({
    table_name: tableName,
    operation,
    record_id: recordId,
    payload,
    timestamp: Date.now(),
  });

  if (navigator.onLine) {
    await flushSyncQueue();
  }
}

export async function flushSyncQueue() {
  const supabase = createClient();
  const queue = await db.syncQueue.orderBy("timestamp").toArray();

  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      if (item.operation === "INSERT") {
        const { error } = await supabase
          .from(item.table_name as any)
          .insert(item.payload);
        if (!error) await db.syncQueue.delete(item.id!);
      } else if (item.operation === "UPDATE") {
        const { error } = await supabase
          .from(item.table_name as any)
          .update(item.payload)
          .eq("id", item.record_id);
        if (!error) await db.syncQueue.delete(item.id!);
      } else if (item.operation === "DELETE") {
        const { error } = await supabase
          .from(item.table_name as any)
          .delete()
          .eq("id", item.record_id);
        if (!error) await db.syncQueue.delete(item.id!);
      }
    } catch (err) {
      console.error(`Sync failure for item ${item.id}:`, err);
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    flushSyncQueue();
  });
}
