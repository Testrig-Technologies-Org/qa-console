CREATE TABLE `test_failure_embeddings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`build_id` int NOT NULL,
	`test_result_id` int NOT NULL,
	`project_id` int NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`unique_key` varchar(512) NOT NULL,
	`case_code` varchar(100),
	`spec_file` varchar(512) NOT NULL,
	`title` text NOT NULL,
	`signature` text NOT NULL,
	`embedding_model` varchar(100),
	`embedding` VECTOR(1536),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `test_failure_embeddings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `test_failure_embeddings` ADD CONSTRAINT `test_failure_embeddings_build_id_automation_builds_id_fk` FOREIGN KEY (`build_id`) REFERENCES `automation_builds`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_failure_embeddings` ADD CONSTRAINT `test_failure_embeddings_test_result_id_test_results_id_fk` FOREIGN KEY (`test_result_id`) REFERENCES `test_results`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_failure_embeddings` ADD CONSTRAINT `test_failure_embeddings_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_failure_embeddings` ADD CONSTRAINT `test_failure_embeddings_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `tfe_build_idx` ON `test_failure_embeddings` (`build_id`);--> statement-breakpoint
CREATE INDEX `tfe_org_idx` ON `test_failure_embeddings` (`organization_id`);--> statement-breakpoint
CREATE INDEX `tfe_pending_idx` ON `test_failure_embeddings` (`embedding_model`);