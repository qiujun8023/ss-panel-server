ALTER TABLE `node_token` ADD `title` varchar(255) NOT NULL AFTER `node_id`;
ALTER TABLE `node_token` DROP `is_enabled`;
