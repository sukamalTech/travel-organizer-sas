CREATE TABLE `documents` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`file_url` text NOT NULL,
	`file_key` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
