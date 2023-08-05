CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wxId` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `phoneCode` varchar(10) DEFAULT NULL,
  `createTime` datetime NOT NULL,
  `activeTime` datetime DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `pwd` varchar(32) DEFAULT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `curDay` date DEFAULT NULL,
  `taskTime` datetime DEFAULT NULL,
  `description` text,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flag` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;