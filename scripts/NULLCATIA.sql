-- Este es el Script de Creación de Base de Datos para el reino de Nullcatia
-- Para que el programa funcione correctamente, asegúrate de que la base de datos esté vacía antes de ejecutar este script.
-- Si ya existe la base de datos, puedes eliminarla o renombrarla antes de ejecutar este script.
-- En caso de que no se haya creado la base de datos, el programa no funcionara correctamente y no dejara realizar ninguna acción.
-- Este script crea las tablas necesarias y las pobla con datos iniciales.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Base de datos: `nullcatia`
CREATE DATABASE IF NOT EXISTS `nullcatia` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `nullcatia`;

-- Estructura de tabla para la tabla `clans`
-- Modificada: description a VARCHAR(500)
CREATE TABLE `clans` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `clans`
INSERT INTO `clans` (`id`, `name`, `description`) VALUES
(1, 'Clan del Sol Radiante', 'Un clan dedicado a proteger el reino de Nullcatia y a sus habitantes, siendo la línea de defensa numero 1, sus miembros son felinos dispuestos a entregar su vida por su pueblo y sus seres queridos, formados por caballeros, hechiceros, curanderos, etc.'),
(2, 'Clan de la Luna Eterna', 'Los místicos del reino, dedicados al estudio de los antiguos pergaminos y a la magia lunar. Sus miembros son sabios y sigilosos, guardianes de los secretos ancestrales y protectores de la noche, usando su intelecto para resolver conflictos y desvelar misterios.'),
(3, 'Clan del Viento Veloz', 'Expertos exploradores y mensajeros ágiles. Los miembros de este clan son conocidos por su velocidad y su capacidad para navegar cualquier terreno, llevando noticias vitales a través de vastas distancias y descubriendo nuevas rutas y recursos para el reino.'),
(4, 'Clan de la Roca Firme', 'Constructores y artesanos. Este clan es el pilar de la infraestructura del reino, levantando edificios, fortificaciones y puentes. Sus miembros son fuertes, pacientes y meticulosos, asegurando la solidez de cada estructura.'),
(5, 'Clan del Río Plateado', 'Pescadores y comerciantes. Ubicados cerca de las fuentes de agua, este clan se encarga de proveer alimentos y de establecer rutas comerciales con otras especies, fomentando la prosperidad y el intercambio cultural del reino.');

-- Estructura de tabla para la tabla `territories`
-- Modificada: description a VARCHAR(500)
CREATE TABLE `territories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `territories`
INSERT INTO `territories` (`id`, `name`, `description`) VALUES
(1, 'Reino de Nullcatia', 'El corazón del imperio felino, una vasta metrópolis de torres relucientes y jardines frondosos. Aquí residen los líderes, se toman las decisiones cruciales y se celebra la cultura felina en todo su esplendor. Es un lugar de aprendizaje, comercio y paz.'),
(2, 'Valle Esmeralda', 'Una exuberante llanura salpicada de arroyos cristalinos y abundante vida silvestre. Ideal para la caza y el entrenamiento, sus praderas verdes son el hogar de los cachorros más jóvenes y un lugar de esparcimiento para todos los clanes.'),
(3, 'Bosque Crepuscular', 'Un antiguo y misterioso bosque donde la luz del sol apenas penetra, poblado por árboles milenarios y criaturas esquivas. Es un lugar de pruebas para los más valientes y de meditación para los sabios, sus sombras guardan secretos profundos.'),
(4, 'Montañas Susurrantes', 'Imponentes picos rocosos que se elevan hacia el cielo, hogar de los clanes más resilientes y de minerales preciosos. Sus cuevas y pasadizos son ideales para la defensa y para ocultar tesoros, y sus alturas ofrecen vistas inigualables del reino.'),
(5, 'Gruta Rocosa', 'Una serie de cavernas interconectadas y pasajes subterráneos, un refugio seguro durante las tormentas y un lugar de excavación para encontrar artefactos antiguos. Sus formaciones rocosas únicas son un espectáculo visual y un desafío para los exploradores.');

-- Estructura de tabla para la tabla `cats`
-- Solo los 12 personajes felinos, con role, special_ability y birth_date
CREATE TABLE `cats` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `clan_id` int(11) NOT NULL,
  `territory_id` int(11) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `special_ability` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `cats`
INSERT INTO `cats` (`id`, `name`, `birth_date`, `clan_id`, `territory_id`, `role`, `special_ability`) VALUES
(1, 'Felix Socketpaw', '2017-03-15', 1, 1, 'Arquitecto de Conexiones', 'Invoca el Pool de Conexiones Eternas para reutilizar sockets sin perder paquetes.'),
(2, 'Serafina Cachewhisker', '2020-09-20', 2, 2, 'Guardiana de la Latencia', 'Teje memorias LRU con su pelaje, reduciendo tiempos de lectura y evitando sobrecargas.'),
(3, 'Captain Middleware', '2015-11-01', 3, 3, 'Centinela de Seguridad', 'Filtra amenazas y documenta cada ruta antes de permitir el paso.'),
(4, 'Ajax Whisperpaw', '2022-01-07', 4, 4, 'Mensajero Asíncrono', 'Domina fetch/Axios y muestra indicadores de carga consistentes.'),
(5, 'Nova Schemaforge', '2018-04-22', 1, 5, 'Ingeniera de Datos', 'Normaliza tablas, diseña claves foráneas y redacta seeds de prueba.'),
(6, 'Echo Testclaw', '2016-07-30', 2, 1, 'Inspector de Calidad', 'Automatiza pruebas con Jest/Supertest y verifica endpoints REST.'),
(7, 'Orion Rollback', '2023-02-14', 3, 2, 'Guardián de Integridad', 'Supervisa transacciones y ejecuta ROLLBACK en fallas críticas.'),
(8, 'Vega Docstring', '2020-05-01', 4, 3, 'Cronista Oficial', 'Mantiene Swagger/OpenAPI y comentarios JSDoc en todo el código.'),
(9, 'Sparkle Templatetail', '2019-10-10', 1, 4, 'Arquitecta de Vistas', 'Ensambla layouts y parciales EJS con precisión felina.'),
(10, 'Luna Styleshade', '2022-03-25', 2, 5, 'Maestra de Estilos', 'Diseña guías de estilo responsivas y accesibles.'),
(11, 'Pixel Purrfect', '2017-08-08', 3, 1, 'Diseñador UI', 'Ajusta cada píxel en la interfaz y crea arte vectorial gatuno.'),
(12, 'Byte Guardian', '2021-12-19', 4, 2, 'Monitor de Rendimiento', 'Analiza métricas, detecta fugas de memoria y optimiza uso de CPU/RAM.');

-- Estructura de tabla para la tabla `scrolls`
CREATE TABLE `scrolls` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` text DEFAULT NULL,
  `cat_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `scrolls` (12 pergaminos, cada uno asociado a un gato)
INSERT INTO `scrolls` (`id`, `title`, `content`, `cat_id`) VALUES
(1, 'Guía de Optimización de Redes', 'Un compendio de técnicas para mantener la conectividad del reino sin interrupciones.', 1),
(2, 'El Arte de la Persistencia Rápida', 'Estrategias para almacenar y recuperar datos a la velocidad del pensamiento.', 2),
(3, 'Defensa contra Amenazas Cibernéticas', 'Protocolos de seguridad y filtros para proteger el flujo de información.', 3),
(4, 'Comunicación Fluida entre Sistemas', 'Principios para asegurar que los mensajes lleguen a tiempo, sin demoras.', 4),
(5, 'Fundamentos de la Estructura de Datos', 'Cómo organizar la información del reino para una eficiencia máxima.', 5),
(6, 'Manual de Pruebas Rigurosas', 'Metodologías para garantizar que cada componente del reino funcione a la perfección.', 6),
(7, 'Recuperación de Desastres del Reino', 'Procedimientos para restaurar el orden y la integridad ante cualquier adversidad.', 7),
(8, 'Crónicas del Código Sagrado', 'Un registro detallado y comprensible de todas las leyes y algoritmos del reino.', 8),
(9, 'Diseño de Interfases Mágicas', 'Secretos para construir las vistas más hermosas y funcionales del reino.', 9),
(10, 'Armonía Visual para el Reino', 'Principios de diseño responsivo y accesibilidad para todos los felinos.', 10),
(11, 'El Toque Maestro del Diseño Felino', 'Técnicas para perfeccionar cada detalle visual y crear arte vectorial gatuno.', 11),
(12, 'Vigilancia y Salud del Sistema', 'Cómo monitorear el rendimiento del reino y detectar cualquier anomalía.', 12);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cats`
--
ALTER TABLE `cats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clan_id` (`clan_id`),
  ADD KEY `territory_id` (`territory_id`);

--
-- Indices de la tabla `clans`
--
ALTER TABLE `clans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `scrolls`
--
ALTER TABLE `scrolls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cat_id` (`cat_id`);

--
-- Indices de la tabla `territories`
--
ALTER TABLE `territories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cats`
-- Ajustado para continuar después de los 12 personajes.
ALTER TABLE `cats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `clans`
--
ALTER TABLE `clans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `scrolls`
--
ALTER TABLE `scrolls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `territories`
--
ALTER TABLE `territories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cats`
--
ALTER TABLE `cats`
  ADD CONSTRAINT `cats_ibfk_1` FOREIGN KEY (`clan_id`) REFERENCES `clans` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cats_ibfk_2` FOREIGN KEY (`territory_id`) REFERENCES `territories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `scrolls`
--
ALTER TABLE `scrolls`
  ADD CONSTRAINT `scrolls_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;