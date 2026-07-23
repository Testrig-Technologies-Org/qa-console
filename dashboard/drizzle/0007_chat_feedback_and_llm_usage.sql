CREATE TABLE `chat_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`user_id` varchar(255),
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`rating` varchar(10) NOT NULL,
	`comment` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `llm_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`user_id` varchar(255),
	`model` varchar(100) NOT NULL,
	`purpose` varchar(50) NOT NULL DEFAULT 'chat',
	`prompt_tokens` int NOT NULL DEFAULT 0,
	`candidate_tokens` int NOT NULL DEFAULT 0,
	`total_tokens` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `llm_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chat_feedback` ADD CONSTRAINT `chat_feedback_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_feedback` ADD CONSTRAINT `chat_feedback_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `llm_usage` ADD CONSTRAINT `llm_usage_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `llm_usage` ADD CONSTRAINT `llm_usage_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `chat_feedback_org_idx` ON `chat_feedback` (`organization_id`);--> statement-breakpoint
CREATE INDEX `llm_usage_org_idx` ON `llm_usage` (`organization_id`);--> statement-breakpoint
CREATE INDEX `llm_usage_created_idx` ON `llm_usage` (`created_at`);