/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

DROP DATABASE IF EXISTS `hotel`;
CREATE DATABASE IF NOT EXISTS `hotel` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hotel`;

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(128) NOT NULL DEFAULT '0',
  `passwordHash` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `administrator`;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `passwordHash`) VALUES
	(1, 'pperic', '12345'),
	(2, 'aaleksic', 'asfjasfags12'),
	(3, 'nnikolic', '81369DDC64EBB26E7FF2D0B2CC3DB8ADD14E13754114F45A297D3F18684CCC93B4B66725AC43E9D6ED4309D5E6E1B9B33473025E8E343110F515E0BF1E7332CD'),
	(5, 'admin', 'C7AD44CBAD762A5DA0A452F9E854FDC1E0E7A52A38015F23F3EAB1D80B931DD472634DFAC71CD34EBC35D16AB7FB8A90C81F975113D6C7538DC69DD8DE9077EC');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int unsigned NOT NULL AUTO_INCREMENT,
  `room_id` int unsigned NOT NULL DEFAULT '0',
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  KEY `fk_photo_room_id` (`room_id`),
  CONSTRAINT `fk_photo_room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `photo`;
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `room_id`, `image_path`) VALUES
	(1, 1, 'asd//picture.doc'),
	(3, 1, '202128-579881010371-th.jpg');
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `reservation_id` int unsigned NOT NULL AUTO_INCREMENT,
  `room_id` int unsigned NOT NULL DEFAULT '0',
  `status` enum('prihvaceno','odbijeno','na cekanju') NOT NULL DEFAULT 'na cekanju',
  `user_id` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`reservation_id`),
  KEY `fk_reservation_room_id` (`room_id`),
  KEY `fk_reservation_user_id` (`user_id`),
  CONSTRAINT `fk_reservation_room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_reservation_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `reservation`;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `room_id` int unsigned NOT NULL AUTO_INCREMENT,
  `status` enum('dostupna','nedostupna') NOT NULL DEFAULT 'dostupna',
  `except` varchar(128) NOT NULL DEFAULT '0',
  `image_path` varchar(255) NOT NULL DEFAULT '0',
  `description` varchar(255) NOT NULL DEFAULT '0',
  `name` text,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `room`;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` (`room_id`, `status`, `except`, `image_path`, `description`, `name`) VALUES
	(1, 'dostupna', 'vrlo kratak opis sobe', '1242567dfo', 'vrlo dugacak opis sobe', 'zavrsna soba'),
	(2, 'dostupna', 'asfasfasf', 'dgsgsdhsdh', 'dgsdgsdgsdgsg', 'sala2'),
	(3, 'nedostupna', 'asfasfasf', 'gdsgsdgsd', 'gsdgasa', 'sala1'),
	(4, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(10, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(11, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(12, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(13, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(14, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(15, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(16, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(17, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(18, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(19, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(20, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba'),
	(21, 'dostupna', 'kratak opis', '0', 'dugacak opis', 'novaSoba1');
/*!40000 ALTER TABLE `room` ENABLE KEYS */;

DROP TABLE IF EXISTS `room_feature`;
CREATE TABLE IF NOT EXISTS `room_feature` (
  `room_feature_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL DEFAULT '0',
  `room_id` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`room_feature_id`),
  KEY `fk_room_feature_room_id` (`room_id`),
  CONSTRAINT `fk_room_feature_room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `room_feature`;
/*!40000 ALTER TABLE `room_feature` DISABLE KEYS */;
INSERT INTO `room_feature` (`room_feature_id`, `name`, `room_id`) VALUES
	(2, 'balkon', 2),
	(4, 'radna prostorija', 2),
	(11, 'garderober', 1),
	(12, 'kuhinja', 1);
/*!40000 ALTER TABLE `room_feature` ENABLE KEYS */;

DROP TABLE IF EXISTS `room_price`;
CREATE TABLE IF NOT EXISTS `room_price` (
  `room_price_id` int unsigned NOT NULL AUTO_INCREMENT,
  `room_id` int unsigned NOT NULL DEFAULT '0',
  `price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`room_price_id`),
  KEY `fk_room_price_room_id` (`room_id`),
  CONSTRAINT `fk_room_price_room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `room_price`;
/*!40000 ALTER TABLE `room_price` DISABLE KEYS */;
INSERT INTO `room_price` (`room_price_id`, `room_id`, `price`) VALUES
	(1, 1, 1234.00),
	(2, 2, 42.00),
	(3, 10, 1234.00),
	(4, 11, 1234.00),
	(5, 12, 1234.00),
	(6, 13, 1234.00),
	(7, 14, 1234.00),
	(8, 15, 1234.00),
	(9, 16, 1234.00),
	(10, 17, 1234.00),
	(11, 18, 1234.00),
	(12, 19, 1234.00),
	(13, 20, 1234.00),
	(14, 21, 1234.00);
/*!40000 ALTER TABLE `room_price` ENABLE KEYS */;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL DEFAULT '0',
  `passwordHash` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `email`, `passwordHash`) VALUES
	(1, 'ppetrovic@gmail.com', 'B14361404C078FFD549C03DB443C3FEDE2F3E534D73F78F77301ED97D4A436A9FD9DB05EE8B325C0AD36438B43FEC8510C204FC1C1EDB21D0941C00E9E2C1CE2');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
