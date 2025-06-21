const pool = require('../../config/db');

const Cat = {
    // Método existente: Obtener todos los gatitos con nombres de clan y territorio
    getAll: async () => {
        // Añadir try-catch para robustez
        try {
            const [rows] = await pool.query(
                `SELECT cats.*, clans.name AS clan_name, territories.name AS territory_name
                FROM cats
                LEFT JOIN clans ON cats.clan_id = clans.id
                LEFT JOIN territories ON cats.territory_id = territories.id`
            );
            return rows;
        } catch (error) {
            console.error('Error en Cat.getAll:', error);
            throw error; // Re-lanzar el error para que sea manejado por el controlador
        }
    },

    // Método existente: Obtener un gatito por ID
    getById: async (id) => {
        try {
            const [rows] = await pool.query('SELECT * FROM cats WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en Cat.getById:', error);
            throw error;
        }
    },

    // Método existente: Crear un nuevo gatito
    create: async (cat) => {
        try {
            // Se cambiaron 'rol' a 'role' y 'habilidad_especial' a 'special_ability'
            const { name, clan_id, territory_id, birth_date, role, special_ability } = cat;
            const [result] = await pool.query(
                'INSERT INTO cats (name, clan_id, territory_id, birth_date, role, special_ability) VALUES (?, ?, ?, ?, ?, ?)',
                [name, clan_id, territory_id, birth_date, role, special_ability]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error en Cat.create:', error);
            throw error;
        }
    },

    // Método existente: Actualizar un gatito existente
    update: async (id, cat) => {
        try {
            // Se cambiaron 'rol' a 'role' y 'habilidad_especial' a 'special_ability'
            const { name, clan_id, territory_id, birth_date, role, special_ability } = cat;
            const [result] = await pool.query(
                'UPDATE cats SET name = ?, clan_id = ?, territory_id = ?, birth_date = ?, role = ?, special_ability = ? WHERE id = ?',
                [name, clan_id, territory_id, birth_date, role, special_ability, id]
            );
            return result;
        } catch (error) {
            console.error('Error en Cat.update:', error);
            throw error;
        }
    },

    // Método existente: Eliminar un gatito
    delete: async (id) => {
        try {
            const [result] = await pool.query('DELETE FROM cats WHERE id = ?', [id]);
            return result;
        } catch (error) {
            console.error('Error en Cat.delete:', error);
            throw error;
        }
    },

    // --- MÉTODOS PARA PAGINACIÓN Y BÚSQUEDA (CON try...catch AÑADIDOS) ---

    // Método para contar todos los gatitos en la base de datos
    countAll: async () => {
        try {
            const [rows] = await pool.query('SELECT COUNT(*) as count FROM cats');
            console.log("CatModel countAll rows:", rows); // Para depuración
            return rows;
        } catch (error) {
            console.error('Error counting all cats in model:', error);
            throw error; // Re-lanzar el error
        }
    },

    // Método para obtener gatitos con paginación
    getAllPaginated: async (limit, offset) => {
        try {
            const [rows] = await pool.query(
                `SELECT cats.*, clans.name AS clan_name, territories.name AS territory_name
                FROM cats
                LEFT JOIN clans ON cats.clan_id = clans.id
                LEFT JOIN territories ON cats.territory_id = territories.id
                ORDER BY cats.id ASC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching all cats paginated in model:', error);
            throw error;
        }
    },

    // Método para contar los resultados de una búsqueda por nombre
    countSearchResults: async (name) => {
        try {
            const [rows] = await pool.query(
                'SELECT COUNT(*) as count FROM cats WHERE name LIKE ?',
                [`%${name}%`]
            );
            console.log("CatModel countSearchResults rows:", rows); // Para depuración
            return rows;
        } catch (error) {
            console.error('Error counting search results in model:', error);
            throw error; // Re-lanzar el error
        }
    },

    // Método para buscar gatitos por nombre con paginación
    searchByNamePaginated: async (name, limit, offset) => {
        try {
            const [rows] = await pool.query(
                `SELECT cats.*, clans.name AS clan_name, territories.name AS territory_name
                FROM cats
                LEFT JOIN clans ON cats.clan_id = clans.id
                LEFT JOIN territories ON cats.territory_id = territories.id
                WHERE cats.name LIKE ?
                ORDER BY cats.id ASC
                LIMIT ? OFFSET ?`,
                [`%${name}%`, limit, offset]
            );
            return rows;
        } catch (error) {
            console.error('Error searching cats by name paginated in model:', error);
            throw error;
        }
    }
};

module.exports = Cat;