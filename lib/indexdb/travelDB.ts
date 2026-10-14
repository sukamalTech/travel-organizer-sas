// lib/travelDB.ts

const DB_NAME = "DynamicExplorerDB";
const DB_VERSION = 1;

export interface TripWorkspace {
  id: string;
  title: string;
  destination: string;
  itinerary: any[];
  photos?: string[];
  updatedAt: number;
}

export function openTravelDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("IndexedDB is only available in the browser"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create a store for trips/itineraries if it doesn't exist
      if (!db.objectStoreNames.contains("trips")) {
        db.createObjectStore("trips", { keyPath: "id" });
      }

      // Create a store for offline user actions (like adding stops while offline)
      if (!db.objectStoreNames.contains("offlineQueue")) {
        db.createObjectStore("offlineQueue", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  });
}

// Save or Update a Trip Workspace in IndexedDB
export async function saveTripOffline(trip: TripWorkspace): Promise<void> {
  const db = await openTravelDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("trips", "readwrite");
    const store = transaction.objectStore("trips");
    const request = store.put({ ...trip, updatedAt: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Retrieve a Trip by ID from IndexedDB
export async function getTripOffline(
  tripId: string,
): Promise<TripWorkspace | null> {
  const db = await openTravelDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("trips", "readonly");
    const store = transaction.objectStore("trips");
    const request = store.get(tripId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// Save an action to sync later when back online
export async function queueOfflineAction(action: {
  type: string;
  payload: any;
}) {
  const db = await openTravelDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("offlineQueue", "readwrite");
    const store = transaction.objectStore("offlineQueue");
    const request = store.add({ ...action, timestamp: Date.now() });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
