
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `nullcatia` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `nullcatia`;


CREATE TABLE `cats` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `clan_id` int(11) NOT NULL,
  `territory_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




INSERT INTO `cats` (`id`, `name`, `birth_date`, `clan_id`, `territory_id`) VALUES
(1, 'Whiskers', '2022-03-10', 1, 1),
(2, 'Shadow', '2023-01-20', 2, 2),
(3, 'Mittens', '2021-11-05', 1, 5),
(4, 'Luna', '2022-07-15', 3, 3),
(5, 'Blaze', '2024-02-28', 4, 4),
(6, 'Sparky', '2023-09-01', 1, 1);



CREATE TABLE `cat_parchment` (
  `cat_id` int(11) NOT NULL,
  `parchment_id` int(11) NOT NULL,
  `consultation_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `cat_parchment` (`cat_id`, `parchment_id`, `consultation_date`) VALUES
(1, 1, '2024-06-10 10:00:00'),
(1, 3, '2024-06-12 14:30:00'),
(2, 2, '2024-06-11 08:45:00'),
(3, 1, '2024-06-13 16:00:00'),
(4, 4, '2024-06-14 09:15:00');


CREATE TABLE `clans` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `clans` (`id`, `name`, `description`) VALUES
(1, 'Clan del Sol Radiante', ''),
(2, 'Clan de la Luna Eterna', NULL),
(3, 'Clan del Viento Veloz', NULL),
(4, 'Clan de la Roca Firme', NULL);


CREATE TABLE `parchments` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` text DEFAULT NULL,
  `clan_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `parchments` (`id`, `title`, `content`, `clan_id`) VALUES
(1, 'El Arte de la Siesta Perfecta', 'Descubre los secretos de una siesta reparadora bajo el sol.', 1),
(2, 'Guía de Caza Nocturna Avanzada', 'Técnicas para acechar presas bajo la luz de la luna.', 2),
(3, 'Historia Antigua de NULLCATIA', 'Un recuento de los primeros días del reino felino.', NULL),
(4, 'Los 5 Principios del Maullido Eficaz', 'Cómo comunicarse con humanos para obtener más comida.', 3),
(5, 'Construcción de Refugios Seguros', 'Guía para encontrar y adaptar los mejores escondites.', 4);


CREATE TABLE `scrolls` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` text DEFAULT NULL,
  `cat_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `scrolls` (`id`, `title`, `content`, `cat_id`) VALUES
(1, 'El Arte de la Siesta Perfecta', 'Descubre los secretos de una siesta reparadora bajo el sol.', 1),
(2, 'Guía de Caza Nocturna Avanzada', 'Técnicas para acechar presas bajo la luz de la luna.', 2),
(3, 'Los 5 Principios del Maullido Eficaz', 'Cómo comunicarse con humanos para obtener más comida.', 3),
(4, 'Historia Antigua de NULLCATIA', 'Un recuento de los primeros días del reino felino.', NULL),
(5, 'Construcción de Refugios Seguros', 'Guía para encontrar y adaptar los mejores escondites.', 1),
(8, 'La travesía De los 4 Felinos', 'si', NULL);



CREATE TABLE `territories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `territories` (`id`, `name`, `description`) VALUES
(1, 'Valle Esmeralda', ''),
(2, 'Bosque Crepuscular', NULL),
(3, 'Montañas Susurrantes', NULL),
(4, 'Gruta Rocosa', NULL),
(5, 'Río Plateado', NULL);


ALTER TABLE `cats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clan_id` (`clan_id`),
  ADD KEY `territory_id` (`territory_id`);


ALTER TABLE `cat_parchment`
  ADD PRIMARY KEY (`cat_id`,`parchment_id`),
  ADD KEY `parchment_id` (`parchment_id`);


ALTER TABLE `clans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `parchments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clan_id` (`clan_id`);


ALTER TABLE `scrolls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cat_id` (`cat_id`);


ALTER TABLE `territories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);


ALTER TABLE `cats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;


ALTER TABLE `clans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;


ALTER TABLE `parchments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;


ALTER TABLE `scrolls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;


ALTER TABLE `territories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;



ALTER TABLE `cats`
  ADD CONSTRAINT `cats_ibfk_1` FOREIGN KEY (`clan_id`) REFERENCES `clans` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cats_ibfk_2` FOREIGN KEY (`territory_id`) REFERENCES `territories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `cat_parchment`
  ADD CONSTRAINT `cat_parchment_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cat_parchment_ibfk_2` FOREIGN KEY (`parchment_id`) REFERENCES `parchments` (`id`) ON DELETE CASCADE;


ALTER TABLE `parchments`
  ADD CONSTRAINT `parchments_ibfk_1` FOREIGN KEY (`clan_id`) REFERENCES `clans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `scrolls`
  ADD CONSTRAINT `scrolls_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
