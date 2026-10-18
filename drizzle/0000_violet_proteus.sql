CREATE TABLE `accommodations` (
	`id` varchar(36) NOT NULL,
	`trip_id` varchar(36) NOT NULL,
	`day_id` varchar(36),
	`name` text NOT NULL,
	`place_name` text,
	`facilities` json,
	`status` text NOT NULL,
	`latitude` decimal(11,8),
	`longitude` decimal(11,8),
	`address` text,
	`phone_number` text,
	`check_in` timestamp(3),
	`check_out` timestamp(3),
	`estimated_cost` decimal(10,2),
	`actual_cost` decimal(10,2),
	`currency` text,
	`booking_reference` text,
	`external_booking_url` text,
	CONSTRAINT `accommodations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attractions` (
	`id` varchar(36) NOT NULL,
	`trip_id` varchar(36) NOT NULL,
	`day_id` varchar(36),
	`name` text NOT NULL,
	`address` text,
	`latitude` decimal(11,8),
	`longitude` decimal(11,8),
	`entry_fee` decimal(10,2),
	`currency` text,
	`opening_time` time,
	`closing_time` time,
	`highlights` json,
	`photography_notes` json,
	CONSTRAINT `attractions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dining_spots` (
	`id` varchar(36) NOT NULL,
	`trip_id` varchar(36) NOT NULL,
	`day_id` varchar(36),
	`name` text NOT NULL,
	`category` text NOT NULL,
	`cuisine_type` text,
	`latitude` decimal(11,8),
	`longitude` decimal(11,8),
	`address` text,
	`estimated_cost` decimal(10,2),
	`rating` decimal(3,2),
	CONSTRAINT `dining_spots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`age` int NOT NULL,
	CONSTRAINT `users_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_table_email_unique` UNIQUE(`email`)
);
