CREATE TABLE `contact_tag_map` (
	`contact_id` varchar(36) NOT NULL,
	`tag_id` varchar(36) NOT NULL,
	CONSTRAINT `contact_tag_map_contact_id_tag_id_pk` PRIMARY KEY(`contact_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `contact_tags` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`is_default` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_user_tag` UNIQUE(`user_id`,`name`)
);
--> statement-breakpoint
CREATE TABLE `itinerary_days` (
	`id` varchar(36) NOT NULL,
	`trip_id` varchar(36) NOT NULL,
	`day_number` int NOT NULL,
	`date` varchar(20) NOT NULL,
	`summary` text,
	`daily_notes` text,
	`night_stay_location` varchar(255),
	`night_stay_notes` text,
	`day_metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `itinerary_days_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `travel_legs` (
	`id` varchar(36) NOT NULL,
	`trip_id` varchar(36) NOT NULL,
	`day_id` varchar(36) NOT NULL,
	`mode` varchar(20) NOT NULL DEFAULT 'car',
	`origin_name` varchar(255) NOT NULL,
	`origin_lat` decimal(11,8),
	`origin_lng` decimal(11,8),
	`destination_name` varchar(255) NOT NULL,
	`destination_lat` decimal(11,8),
	`destination_lng` decimal(11,8),
	`departure_time` time,
	`arrival_time` time,
	`distance_km` double,
	`sequence_order` int NOT NULL DEFAULT 1,
	`metadata` json NOT NULL DEFAULT ('{}'),
	CONSTRAINT `travel_legs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_contacts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`notes` varchar(255),
	`is_frequent` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contact_tag_map` ADD CONSTRAINT `contact_tag_map_contact_id_user_contacts_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `user_contacts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contact_tag_map` ADD CONSTRAINT `contact_tag_map_tag_id_contact_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `contact_tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_tag_lookup` ON `contact_tag_map` (`tag_id`,`contact_id`);--> statement-breakpoint
CREATE INDEX `idx_user_tags` ON `contact_tags` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_itinerary_days_trip_id` ON `itinerary_days` (`trip_id`,`day_number`);--> statement-breakpoint
CREATE INDEX `idx_travel_legs_trip_id` ON `travel_legs` (`trip_id`);--> statement-breakpoint
CREATE INDEX `idx_travel_legs_day_seq` ON `travel_legs` (`day_id`,`sequence_order`);--> statement-breakpoint
CREATE INDEX `idx_user_contacts` ON `user_contacts` (`user_id`);