ALTER TABLE `projects` ADD `api_key` varchar(128);--> statement-breakpoint
UPDATE `projects` SET `api_key` = CONCAT('qac_live_', REPLACE(UUID(), '-', ''), REPLACE(UUID(), '-', '')) WHERE `api_key` IS NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_api_key_unique` UNIQUE(`api_key`);