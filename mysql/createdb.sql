GRANT ALL PRIVILEGES ON * . * TO 'chandola'@'%';
ALTER USER 'chandola'@'%' IDENTIFIED WITH mysql_native_password BY 'password';

DROP DATABASE IF EXISTS outstepdb;
CREATE DATABASE outstepdb;
USE outstepdb

DROP TABLE IF EXISTS `organizations`;
CREATE TABLE `organizations` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `latitude` FLOAT NOT NULL,
  `longitude` FLOAT NOT NULL,
  `url` varchar(256) NOT NULL,
  `logo_url` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `roletype` ENUM('regular','expert'), 
  `image_location` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `sustainability_goals`;
CREATE TABLE `sustainability_goals` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(8) NOT NULL,
  `description` varchar(64) NOT NULL,
  `image_location` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `peoples_framework_tags`;
CREATE TABLE `peoples_framework_tags` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `letter` char(1) NOT NULL,
  `tag` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `users` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `last_modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `firstname` varchar(128) NOT NULL,
  `lastname` varchar(128) NOT NULL,
  `affiliation` varchar(128) DEFAULT NULL,
  `email` varchar(128) NOT NULL UNIQUE,
  `password` varchar(100) NOT NULL,
  `url` varchar(128) DEFAULT NULL,
  `primary_organization` mediumint(9) DEFAULT NULL,
  `role` mediumint(9) DEFAULT NULL,
  `expert_role` mediumint(9) DEFAULT NULL, 
  PRIMARY KEY (`id`),
  FOREIGN KEY (`primary_organization`) REFERENCES organizations(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role`) REFERENCES roles(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`expert_role`) REFERENCES roles(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `user_badges`;
CREATE TABLE `user_badges` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(9) NOT NULL,
  `last_modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_location` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `user_collaborations`;
CREATE TABLE `user_collaborations` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `first_user_id` mediumint(9) NOT NULL,
  `target_user_id` mediumint(9),
  `target_organization_id` mediumint(9),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`first_user_id`) REFERENCES users(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`target_user_id`) REFERENCES users(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`target_organization_id`) REFERENCES organizations(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `user_sustainability_goals`;
CREATE TABLE `user_sustainability_goals`(
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(9) NOT NULL,
  `sustainability_goal` mediumint(9) NOT NULL,
  `primary` BOOLEAN,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sustainability_goal`) REFERENCES sustainability_goals(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `user_peoples_framework_tags`;
CREATE TABLE `user_peoples_framework_tags`(
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(9) NOT NULL,
  `peoples_framework_tag` mediumint(9) NOT NULL,
  `primary` BOOLEAN,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`peoples_framework_tag`) REFERENCES peoples_framework_tags(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `datasets`;
CREATE TABLE `datasets` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `last_modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(128) NOT NULL,
  `contributing_user_id` mediumint(9) NOT NULL,
  `location` varchar(256) NOT NULL,
  `format` ENUM('shapefile','geotiff','kml','geojson','netcdf'),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`contributing_user_id`) REFERENCES users(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

