ALTER TABLE `node` DROP `avatar`;
ALTER TABLE `node` ADD `location` VARCHAR(255) NOT NULL DEFAULT 'us' AFTER `name`;
