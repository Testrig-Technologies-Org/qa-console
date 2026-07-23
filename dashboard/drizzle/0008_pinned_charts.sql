CREATE TABLE `pinned_charts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`project_id` int NOT NULL,
	`user_id` varchar(255),
	`title` varchar(255) NOT NULL,
	`tool_name` varchar(100) NOT NULL DEFAULT 'get_chart_data',
	`args` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pinned_charts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `pinned_charts` ADD CONSTRAINT `pinned_charts_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pinned_charts` ADD CONSTRAINT `pinned_charts_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pinned_charts` ADD CONSTRAINT `pinned_charts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `pinned_charts_org_idx` ON `pinned_charts` (`organization_id`);--> statement-breakpoint
CREATE INDEX `pinned_charts_project_idx` ON `pinned_charts` (`project_id`);