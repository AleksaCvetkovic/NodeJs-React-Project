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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `administrator`;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `passwordHash`) VALUES
	(1, 'pperic', '0766519EF449B3D80A718DFD45CED2C3B4CC91DFDD3CED13E44E6CACFFA9977F92185386170022CC448CC118630F8C84532562A983144CE97D6660D394BEB5C7'),
	(2, 'aaleksic', 'asfjasfags12'),
	(3, 'nnikolic', '81369DDC64EBB26E7FF2D0B2CC3DB8ADD14E13754114F45A297D3F18684CCC93B4B66725AC43E9D6ED4309D5E6E1B9B33473025E8E343110F515E0BF1E7332CD'),
	(5, 'admin', 'C7AD44CBAD762A5DA0A452F9E854FDC1E0E7A52A38015F23F3EAB1D80B931DD472634DFAC71CD34EBC35D16AB7FB8A90C81F975113D6C7538DC69DD8DE9077EC'),
	(6, 'admin1', 'BDB068ED51D467D895D6B581393219AA2A278F58D585F8BB27BF90FDD1922B7EC0AE52981242795FCC670CC0A7C484CDBB794B8FF3CB4617EC6DC86E0A228497');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

DROP TABLE IF EXISTS `administrator_token`;
CREATE TABLE IF NOT EXISTS `administrator_token` (
  `administrator_token_id` int unsigned NOT NULL AUTO_INCREMENT,
  `administrator_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `token` text NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_valid` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`administrator_token_id`),
  KEY `fk_administrator_token_administrator_id` (`administrator_id`),
  CONSTRAINT `fk_administrator_token_administrator_id` FOREIGN KEY (`administrator_id`) REFERENCES `administrator` (`administrator_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `administrator_token`;
/*!40000 ALTER TABLE `administrator_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `administrator_token` ENABLE KEYS */;

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `room`;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` (`room_id`, `status`, `except`, `image_path`, `description`, `name`) VALUES
	(1, 'dostupna', 'vrlo kratak opis sobe', '1242567dfo', 'vrlo dugacak opis sobe', 'zavrsna soba'),
	(2, 'dostupna', 'asfasfasf', 'dgsgsdhsdh', 'dgsdgsdgsdgsg', 'sala2'),
	(3, 'nedostupna', 'asfasfasf', 'gdsgsdgsd', 'gsdgasa', 'sala1'),
	(22, 'dostupna', 'neki krakat opis`', 'puutanja slike', 'neki dugacak opis', 'novaSoba');
/*!40000 ALTER TABLE `room` ENABLE KEYS */;

DROP TABLE IF EXISTS `room_feature`;
CREATE TABLE IF NOT EXISTS `room_feature` (
  `room_feature_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL DEFAULT '0',
  `room_id` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`room_feature_id`),
  KEY `fk_room_feature_room_id` (`room_id`),
  CONSTRAINT `fk_room_feature_room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `room_feature`;
/*!40000 ALTER TABLE `room_feature` DISABLE KEYS */;
INSERT INTO `room_feature` (`room_feature_id`, `name`, `room_id`) VALUES
	(2, 'balkon', 2),
	(4, 'radna prostorija', 2),
	(11, 'garderober', 1),
	(12, 'kuhinja', 1),
	(13, 'balkon', 22),
	(14, 'klima', 22);
/*!40000 ALTER TABLE `room_feature` ENABLE KEYS */;

DROP TABLE IF EXISTS `room_price`;
CREATE TABLE IF NOT EXISTS `room_price` (
  `room_price_id` int unsigned NOT NULL AUTO_INCREMENT,
  `room_id` int unsigned NOT NULL DEFAULT '0',
  `price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`room_price_id`),
  KEY `fk_room_price_room_id` (`room_id`),
  CONSTRAINT `fk_room_price_room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `room_price`;
/*!40000 ALTER TABLE `room_price` DISABLE KEYS */;
INSERT INTO `room_price` (`room_price_id`, `room_id`, `price`) VALUES
	(1, 1, 1234.00),
	(2, 2, 42.00),
	(15, 22, 500.00);
/*!40000 ALTER TABLE `room_price` ENABLE KEYS */;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL DEFAULT '0',
  `passwordHash` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `email`, `passwordHash`) VALUES
	(1, 'ppetrovic@gmail.com', '0310773EA2EAE03F8B1CD3DE96DA655BA111669E7E58F950C07AAC4BA5D074F6EFE20C854FC0613AA71540B82249534B1B3C3653F458AB04E1BE3A812B2B12DA'),
	(4, 'testTest@gmail.com', '8703620C226C72F5E3BAD94DF325F23C2D2B723691367236C5129CAFACE430BC36398B3A25486AE4F21AF480165450907899902D2589CA15599EFC2160A7E1D1');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

DROP TABLE IF EXISTS `user_token`;
CREATE TABLE IF NOT EXISTS `user_token` (
  `user_token_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `token` text NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_valid` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_token_id`),
  KEY `fk_user_token_user_id` (`user_id`),
  CONSTRAINT `fk_user_token_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `user_token`;
/*!40000 ALTER TABLE `user_token` DISABLE KEYS */;
INSERT INTO `user_token` (`user_token_id`, `user_id`, `created_at`, `token`, `expires_at`, `is_valid`) VALUES
	(1, 1, '2021-02-10 12:15:49', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjoxLCJpZGVudGl0eSI6InBwZXRyb3ZpY0BnbWFpbC5jb20iLCJleHAiOjE2MTU2MzQxNDkuODk0LCJpcCI6Ijo6MSIsInVhIjoiUG9zdG1hblJ1bnRpbWUvNy4yNi4xMCIsImlhdCI6MTYxMjk1NTc0OX0.rY4T08L_pZz_JDCl_9hW1xLsMQwiDxX0aMJHhXnsxzk', '2021-03-13 11:15:49', 1),
	(2, 1, '2021-02-11 01:24:24', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjoxLCJpZGVudGl0eSI6InBwZXRyb3ZpY0BnbWFpbC5jb20iLCJleHAiOjE2MTU2ODE0NjQuODg3LCJpcCI6Ijo6MSIsInVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzg4LjAuNDMyNC4xNDYgU2FmYXJpLzUzNy4zNiIsImlhdCI6MTYxMzAwMzA2NH0.Vj1eWs1hh5KrAMlP9XaExxR67Qi7TjpuY7dvSRC2wFA', '2021-03-14 00:24:24', 1),
	(3, 1, '2021-02-11 11:58:23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjoxLCJpZGVudGl0eSI6InBwZXRyb3ZpY0BnbWFpbC5jb20iLCJleHAiOjE2MTU3MTk1MDMuNzEzLCJpcCI6Ijo6MSIsInVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzg4LjAuNDMyNC4xNTAgU2FmYXJpLzUzNy4zNiIsImlhdCI6MTYxMzA0MTEwM30.r5EuR82StxHz4eM2s8Js3jTUW6tGI2ozCeI_evZD7GI', '2021-03-14 10:58:23', 1),
	(4, 4, '2021-02-11 13:48:29', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjo0LCJpZGVudGl0eSI6InRlc3RUZXN0QGdtYWlsLmNvbSIsImV4cCI6MTYxNTcyNjEwOS40NjIsImlwIjoiOjoxIiwidWEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvODguMC40MzI0LjE1MCBTYWZhcmkvNTM3LjM2IiwiaWF0IjoxNjEzMDQ3NzA5fQ.Zk-8NW51q-OWHCp4lbly0TalZ11GN7rFaRPPvZQMcvo', '2021-03-14 12:48:29', 1),
	(5, 4, '2021-02-11 13:51:02', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjo0LCJpZGVudGl0eSI6InRlc3RUZXN0QGdtYWlsLmNvbSIsImV4cCI6MTYxNTcyNjI2Mi4xMDEsImlwIjoiOjoxIiwidWEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvODguMC40MzI0LjE1MCBTYWZhcmkvNTM3LjM2IiwiaWF0IjoxNjEzMDQ3ODYyfQ.o0AWB8J_cKI_AP_7bUc4SGB0G-_R42UwfTJ8wY0rJFE', '2021-03-14 12:51:02', 1);
/*!40000 ALTER TABLE `user_token` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
