# Proyecto NullCatia: Gestión del Reino Felino

## 1\. Descripción General

NULLCATIA es un vasto reino digital habitado por miles de gatitos nulos que nacen sin valores predeterminados y necesitan ser inicializados para encontrar su propósito. Cada gatito pertenece a un Clan que custodia un tipo de Territorio (bosques binarios, ríos de paquetes, montañas de índices, praderas de pila, archipiélago de APIs, cuevas de caché, océanos de objetos, llanuras de logs, valles de versiones). Por tradición, los clanes comparten saberes mediante Pergaminos donde registran consultas ancestrales que devuelven sentido a la existencia felina.
Con la inminente Transformación Felina 4.0, el Consejo ha decidido modernizar su infraestructura con un Backend Sagrado: un conjunto de microservicios Express que exponen un API REST sobre una base de datos MySQL consolidada. Este backend está compuesto por tres artefactos legendarios:
* **El Pool de Conexiones Eternas:** un cántaro encantado que gestiona las corrientes de bits evitando que los gatitos ahoguen el nodo.
* **Los Controladores del Equilibrio:** monjes que validan cada petición y repelen dependencias circulares con la fuerza del async/await.
* **El Enrutador de los Mil Caminos:** un laberinto ordenado en capas donde cada endpoint RESTful revela un pedazo de la memoria gatuna.

-----

## 2\. Características Principales

  * **Gestión de Gatitos:** Registro, consulta, edición y eliminación de gatitos, incluyendo sus roles, habilidades especiales, fecha de nacimiento, clan y territorio.
  * **Gestión de Clanes:** Creación, visualización y descripción de los diversos clanes del reino.
  * **Gestión de Territorios:** Definición y descripción de las zonas geográficas del reino.
  * **Gestión de Pergaminos:** Documentación y asociación de pergaminos con gatitos específicos.
  * **Búsqueda y Paginación:** Funcionalidades de búsqueda por nombre y paginación para facilitar la navegación en listas extensas.
  * **Validación de Datos:** Asegura la integridad de la información ingresada a través de validaciones en el servidor.
  * **Interfaz Intuitiva:** Desarrollada con Bootstrap para una experiencia de usuario amigable y responsiva.

-----

## 3\. Conceptos Clave del Reino NullCatia

En el mundo de NullCatia, cada elemento juega un papel crucial:

  * **Gatitos:** Los personajes centrales del reino, cada uno con un nombre, edad, clan, territorio asignado, un **rol** específico dentro de la sociedad felina y una **habilidad especial** única.
  * **Clanes:** Grupos organizados de gatitos, con su propia identidad y propósito, que colaboran para el bienestar del reino.
  * **Territorios:** Las diversas regiones geográficas del reino, delimitando las zonas de influencia y recursos.
  * **Pergaminos:** Documentos importantes que contienen conocimientos, historias o guías, y que pueden ser consultados por los gatitos.

-----

## 4\. Estructura del Proyecto

El proyecto sigue una arquitectura **Modelo-Vista-Controlador (MVC)**, lo que facilita su mantenimiento y escalabilidad.

![Estructura](https://github.com/user-attachments/assets/0857ed81-826c-4619-aae2-0d4389e1bf21)

-----

## 5\. Esquema y Relación de Tablas de la Base de Datos

La base de datos `nullcatia` consta de las siguientes tablas principales y sus relaciones:

  * **`clans`**: Almacena información sobre los clanes del reino.
      * `id` (PK)
      * `name`
      * `description`
  * **`territories`**: Almacena información sobre las diferentes regiones geográficas.
      * `id` (PK)
      * `name`
      * `description`
  * **`cats`**: Contiene los datos de cada gatito, incluyendo sus roles y habilidades especiales.
      * `id` (PK)
      * `name`
      * `birth_date`
      * `clan_id` (FK a `clans.id`)
      * `territory_id` (FK a `territories.id`)
      * `role`
      * `special_ability`
  * **`scrolls`**: Almacena los pergaminos con su contenido y asociación a un gato.
      * `id` (PK)
      * `title`
      * `content`
      * `cat_id` (FK a `cats.id`)

**Relaciones:**

  * Un `clan` puede tener muchos `cats` (One-to-Many: `clans.id` -\> `cats.clan_id`).
  * Un `territory` puede contener muchos `cats` (One-to-Many: `territories.id` -\> `cats.territory_id`).
  * Un `cat` puede estar asociado a un `scroll` (One-to-Many: `cats.id` -\> `scrolls.cat_id`). Cada `scroll` se asocia a un único `cat`.

![BaseDeDatos](https://github.com/user-attachments/assets/ee06da2f-d61d-44fb-946d-b706af3624fc)

-----

## 6\. Requisitos del Sistema

Antes de iniciar el proyecto, asegúrate de tener instalado el siguiente software:

  * **Node.js:** Versión 16.x o superior. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
  * **MySQL o MariaDB:** Un servidor de base de datos relacional. Puedes usar [enlace sospechoso eliminado] o [MariaDB](https://mariadb.org/download/).
  * **Un cliente de base de datos:** Recomendado para gestionar tu base de datos (ej. phpMyAdmin, MySQL Workbench, DBeaver).

-----

## 7\. Pasos de Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto en tu entorno local:

1.  **Clonar el Repositorio:**
    Abre tu terminal o línea de comandos y navega al directorio donde quieres guardar el proyecto. Luego, ejecuta:

    ```bash
    git clone <URL_DE_TU_REPOSITORIO>
    cd NullCatia
    ```

    *(Nota: Reemplaza `<URL_DE_TU_REPOSITORIO>` con la URL real de tu repositorio Git si usas uno.)*

2.  **Instalar Dependencias de Node.js:**
    Dentro de la carpeta raíz del proyecto (`NullCatia`), ejecuta:

    ```bash
    npm install
    ```

    Esto instalará todas las librerías necesarias definidas en `package.json`.

3.  **Configurar la Base de Datos MySQL/MariaDB:**

      * **Crear la Base de Datos:** Abre tu cliente de base de datos (ej. phpMyAdmin, MySQL Workbench) y crea una nueva base de datos llamada `nullcatia`.
      * **Importar el Script SQL:** Localiza el archivo `nullcatia.sql` en la raíz de tu proyecto. Importa este archivo en la base de datos `nullcatia` que acabas de crear. Este script creará todas las tablas y las poblará con datos de prueba (tus clanes, territorios, gatitos de equipo y pergaminos).

    **[¡ESPACIO PARA CAPTURA DE PANTALLA: Proceso de importación del archivo SQL en phpMyAdmin o tu cliente preferido]**

      * **Configurar la Conexión en la Aplicación:**
        Abre el archivo `config/db.js`. Asegúrate de que las credenciales (`host`, `user`, `password`) coincidan con las de tu servidor MySQL/MariaDB local. Por ejemplo:
        ```javascript
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'TU_CONTRASEÑA_MYSQL', // ¡Asegúrate de poner tu contraseña real aquí!
            database: 'nullcatia',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            charset: 'utf8mb4' // Esto es importante para caracteres especiales
        });
        ```
        **Guarda** el archivo `db.js` después de modificarlo.

4.  **Iniciar el Servidor de la Aplicación:**
    En tu terminal, dentro de la carpeta raíz del proyecto, ejecuta:

    ```bash
    npm start
    ```

    Deberías ver un mensaje como `Servidor escuchando en http://localhost:3000`.

5.  **Acceder a la Aplicación:**
    Abre tu navegador web y ve a:
    `http://localhost:3000`

-----

## 8\. Guía de Uso Paso a Paso

Aquí te mostramos cómo interactuar con las principales funcionalidades de NullCatia:

### 8.1. Página de Inicio

Al acceder a `http://localhost:3000`, serás recibido por la página principal del reino de NullCatia. Esta página sirve como portal de entrada y presenta la narrativa del mundo felino.

**[¡ESPACIO PARA CAPTURA DE PANTALLA: Página de Inicio del programa NullCatia]**

### 8.2. Gestión de Clanes y Territorios (Creación)

Puedes añadir nuevos clanes o territorios desde sus respectivas secciones. Aquí, un ejemplo del formulario para crear un Territorio:

1.  Navega a la sección "Territorios" (o "Clanes" si lo prefieres).
2.  Haz clic en el botón "Añadir Nuevo Territorio".
3.  Completa los campos "Nombre del Territorio" y "Descripción".
4.  Haz clic en "Guardar Territorio".

**[¡ESPACIO PARA CAPTURA DE PANTALLA: Formulario de Creación de Territorio (o Clan si lo prefieres)]**

### 8.3. Formulario de Alta de Gatito

Para añadir un nuevo gatito al reino:

1.  Navega a la sección "Gatitos" desde la barra de navegación.
2.  Haz clic en el botón "Añadir Nuevo Gatito".
3.  Completa los datos del gatito:
      * **Nombre del Gatito:** Obligatorio.
      * **Fecha de Nacimiento:** Opcional, si no se especifica, la edad aparecerá como "Desconocida".
      * **Clan:** Obligatorio. Selecciona uno de los clanes existentes en el menú desplegable.
      * **Territorio:** Opcional. Asigna un territorio o déjalo sin asignar.
      * **Rol:** Obligatorio. Ingresa el rol del gatito (ej. "Arquitecto de Conexiones").
      * **Habilidad Especial:** Obligatorio. Describe su habilidad única (ej. "Invoca el Pool de Conexiones Eternas...").
4.  Haz clic en "Crear Gatito".

**[¡ESPACIO PARA CAPTURA DE PANTALLA: Formulario de Creación de Gatito, con campos llenos]**

### 8.4. Lista de Gatitos

Después de crear o editar gatitos, puedes ver una lista completa de todos los habitantes felinos.

**[¡ESPACIO PARA CAPTURA DE PANTALLA: Vista de la Lista de Gatitos (cats/list) sin filtros]**

### 8.5. Uso de Filtros en la Lista de Gatitos

La lista de gatitos permite filtrar y paginar para encontrar información rápidamente:

1.  **Filtro por Nombre:** Utiliza el campo de búsqueda en la parte superior para buscar gatitos por su nombre.
      * Introduce un nombre (o parte de él) en el campo "Buscar gatito por nombre..." y haz clic en "Buscar".
      * Para borrar la búsqueda, haz clic en "Limpiar búsqueda".
2.  **Paginación:** Si hay muchos gatitos, utiliza los controles de paginación (\<\< 1 2 3 \>\>) en la parte inferior de la tabla para navegar entre las páginas.

**[¡ESPACIO PARA CAPTURA DE PANTALLA: Vista de la Lista de Gatitos con el campo de búsqueda lleno o con un filtro aplicado]**

### 8.6. Edición y Eliminación de Entradas

En todas las listas (Gatitos, Clanes, Territorios, Pergaminos), encontrarás botones de "Editar" y "Eliminar" junto a cada entrada, permitiendo gestionar los datos del reino.

-----

## 9\. Conclusión 

Aqui ira la conclusión del Readme (Editar más tarde)
