// src/lib/db/offlineStore.ts
import Dexie, { Table } from "dexie";

export interface LocalTrip {
  id: string;
  owner_id: string;
  title: string;
  start_date: string;
  end_date: string;
  primary_mode: string;
  payload: any;
  sync_status: "synced" | "created" | "updated" | "deleted";
  updated_at: number;
}

export interface SyncQueueItem {
  id?: number;
  table_name: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  record_id: string;
  payload: any;
  timestamp: number;
}

export class TravelSaaSDatabase extends Dexie {
  trips!: Table<LocalTrip>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super("TravelSaaSOfflineDB");
    this.version(1).stores({
      trips: "id, owner_id, sync_status, updated_at",
      syncQueue: "++id, table_name, operation, record_id, timestamp",
    });
  }
}

export const db = new TravelSaaSDatabase();
