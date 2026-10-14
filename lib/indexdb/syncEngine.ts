// lib/syncEngine.ts   ... https://gemini.google.com/app/4da4cc1165459587?hl=en-IN
import { openTravelDB } from "./travelDB";

export interface PendingAction {
  id?: number;
  type: "ADD_STOP" | "UPDATE_TRIP" | "DELETE_STOP";
  endpoint: string;
  payload: any;
  timestamp: number;
}

// 1. Add an action to the offline queue when internet is down
export async function queueOfflineAction(
  action: Omit<PendingAction, "timestamp">,
) {
  const db = await openTravelDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("offlineQueue", "readwrite");
    const store = transaction.objectStore("offlineQueue");
    const request = store.add({ ...action, timestamp: Date.now() });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 2. Process all pending offline actions when online connection returns
export async function processOfflineQueue() {
  if (!navigator.onLine) return;

  const db = await openTravelDB();

  // Fetch all pending queued items
  const actions: PendingAction[] = await new Promise((resolve, reject) => {
    const transaction = db.transaction("offlineQueue", "readonly");
    const store = transaction.objectStore("offlineQueue");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });

  if (actions.length === 0) return;

  console.log(
    `📡 Back online! Syncing ${actions.length} pending actions to server...`,
  );

  // Process actions sequentially to keep database order correct
  for (const action of actions) {
    try {
      const response = await fetch(action.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.payload),
      });

      if (response.ok) {
        // Remove processed item from IndexedDB queue
        await removeQueuedAction(action.id!);
        console.log(`✅ Successfully synced action #${action.id}`);
      } else {
        console.error(
          `Failed to sync action #${action.id}. Server responded with error.`,
        );
      }
    } catch (error) {
      console.error(
        `Network error during sync for action #${action.id}:`,
        error,
      );
      break; // Stop loop if network connection drops again mid-sync
    }
  }
}

// Helper: Remove synced item from queue
function removeQueuedAction(id: number): Promise<void> {
  return openTravelDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("offlineQueue", "readwrite");
      const store = transaction.objectStore("offlineQueue");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}
