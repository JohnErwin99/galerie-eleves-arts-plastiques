CREATE TABLE `admin_credentials` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`updated_at` integer NOT NULL
);
