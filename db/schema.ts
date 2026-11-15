import {
  mysqlTable,
  serial,
  varchar,
  int,
  text,
  decimal,
  timestamp,
  time,
  json,
  primaryKey,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  age: int("age").notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

// Accomodation schema
export const accommodations = mysqlTable("accommodations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  tripId: varchar("trip_id", { length: 36 }).notNull(),
  dayId: varchar("day_id", { length: 36 }), // Optional field
  name: text("name").notNull(),

  // New Optional Fields
  placeName: text("place_name"), // 1) Optional Place Name
  facilities: json("facilities"), // 2) Optional Facilities Array (e.g., ["parking", "wifi", "pool"])

  status: text("status").notNull(),
  latitude: decimal("latitude", { precision: 11, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  phoneNumber: text("phone_number"),
  checkIn: timestamp("check_in", { mode: "string", fsp: 3 }),
  checkOut: timestamp("check_out", { mode: "string", fsp: 3 }),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  currency: text("currency"),
  bookingReference: text("booking_reference"),
  externalBookingUrl: text("external_booking_url"),
});
export type Accommodation = typeof accommodations.$inferSelect;
export type NewAccommodation = typeof accommodations.$inferInsert;

// Dining schema
export const diningSpots = mysqlTable("dining_spots", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  tripId: varchar("trip_id", { length: 36 }).notNull(),
  dayId: varchar("day_id", { length: 36 }), // Optional / nullable
  name: text("name").notNull(),
  category: text("category").notNull(),
  cuisineType: text("cuisine_type"),
  latitude: decimal("latitude", { precision: 11, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }), // e.g. up to 5.00 rating score
});

export type DiningSpot = typeof diningSpots.$inferSelect;
export type NewDiningSpot = typeof diningSpots.$inferInsert;

// Attraction schema (distanceFromBaseKm removed to match TiDB database)
export const attractions = mysqlTable("attractions", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  tripId: varchar("trip_id", { length: 36 }).notNull(),
  dayId: varchar("day_id", { length: 36 }), // Optional / nullable
  name: text("name").notNull(),
  address: text("address"),
  latitude: decimal("latitude", { precision: 11, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }),
  currency: text("currency"),
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  highlights: json("highlights"), // Stored as JSON array in MySQL/TiDB
  photographyNotes: json("photography_notes"), // Stored as JSON array/object in MySQL/TiDB
});

export type Attraction = typeof attractions.$inferSelect;
export type NewAttraction = typeof attractions.$inferInsert;

// db/schema.ts

export const documents = mysqlTable("documents", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID or cuid
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileKey: varchar("file_key", { length: 255 }).notNull(), // Required to delete from Uploadthing
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

// 1. Contact Tags Table (Default + User-Created Custom Tags)
export const contactTags = mysqlTable(
  "contact_tags",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("unique_user_tag").on(table.userId, table.name),
    index("idx_user_tags").on(table.userId),
  ],
);

// 2. User Contacts Table
export const userContacts = mysqlTable(
  "user_contacts",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    notes: varchar("notes", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("idx_user_contacts").on(table.userId)],
);

// 3. Many-to-Many Junction Table (Links one contact to multiple tags)
export const contactTagMap = mysqlTable(
  "contact_tag_map",
  {
    contactId: varchar("contact_id", { length: 36 })
      .notNull()
      .references(() => userContacts.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 36 })
      .notNull()
      .references(() => contactTags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.contactId, table.tagId] }),
    index("idx_tag_lookup").on(table.tagId, table.contactId),
  ],
);
