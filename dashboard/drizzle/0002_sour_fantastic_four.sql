DROP INDEX `build_session_idx` ON `automation_builds`;--> statement-breakpoint
ALTER TABLE `automation_builds` ADD CONSTRAINT `project_session_unique_idx` UNIQUE(`project_id`,`session_id`);