CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`project_id` int,
	`user_id` varchar(255) NOT NULL,
	`role` varchar(10) NOT NULL,
	`text` text NOT NULL,
	`question` text,
	`tool_calls` json,
	`error` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `chat_messages_org_idx` ON `chat_messages` (`organization_id`);--> statement-breakpoint
CREATE INDEX `chat_messages_user_project_idx` ON `chat_messages` (`user_id`,`project_id`);