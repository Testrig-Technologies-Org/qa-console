-- TiDB doesn't support DROP PRIMARY KEY on a table using a clustered index (which a single-int
-- PK gets by default) — Error 8200 "Unsupported drop primary key when the table is using
-- clustered index". This table only ever holds transient/ephemeral rows (deleted once each CI
-- run's globalSetup teardown fires), so recreating it is safe rather than trying to ALTER in
-- place.
DROP TABLE IF EXISTS `automation_live_frames`;--> statement-breakpoint
CREATE TABLE `automation_live_frames` (
	`build_id` int NOT NULL,
	`worker_id` int NOT NULL DEFAULT 0,
	`frame_data` mediumtext NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automation_live_frames_build_id_worker_id_pk` PRIMARY KEY(`build_id`,`worker_id`)
);--> statement-breakpoint
ALTER TABLE `automation_live_frames` ADD CONSTRAINT `automation_live_frames_build_id_automation_builds_id_fk` FOREIGN KEY (`build_id`) REFERENCES `automation_builds`(`id`) ON DELETE cascade ON UPDATE no action;