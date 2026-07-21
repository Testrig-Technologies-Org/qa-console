CREATE TABLE `automation_live_frames` (
	`build_id` int NOT NULL,
	`frame_data` mediumtext NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automation_live_frames_build_id` PRIMARY KEY(`build_id`)
);
--> statement-breakpoint
ALTER TABLE `automation_live_frames` ADD CONSTRAINT `automation_live_frames_build_id_automation_builds_id_fk` FOREIGN KEY (`build_id`) REFERENCES `automation_builds`(`id`) ON DELETE cascade ON UPDATE no action;