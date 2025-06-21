const pool = require('../../config/db');

const Scroll = {
    // Método existente: Obtener todos los scrolls con el nombre del gatito asociado
    getAll: async () => {
        try {
            const [rows] = await pool.query(
                'SELECT s.*, c.name AS cat_name FROM scrolls s LEFT JOIN cats c ON s.cat_id = c.id ORDER BY s.id ASC'
            );
            return rows;
        } catch (error) {
            console.error('Error en Scroll.getAll:', error);
            throw error;
        }
    },

    // Método existente: Obtener un scroll por ID
    getById: async (id) => {
        try {
            const [rows] = await pool.query('SELECT * FROM scrolls WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en Scroll.getById:', error);
            throw error;
        }
    },

    // Método existente: Crear un nuevo scroll
    create: async (scroll) => {
        try {
            const { cat_id, title, content } = scroll;
            const [result] = await pool.query(
                'INSERT INTO scrolls (cat_id, title, content) VALUES (?, ?, ?)',
                [cat_id, title, content]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error en Scroll.create:', error);
            throw error;
        }
    },

    // Método existente: Actualizar un scroll existente
    update: async (id, scroll) => {
        try {
            const { title, content, cat_id } = scroll;
            const [result] = await pool.query(
                'UPDATE scrolls SET title = ?, content = ?, cat_id = ? WHERE id = ?',
                [title, content, cat_id, id]
            );
            return result;
        } catch (error) {
            console.error('Error en Scroll.update:', error);
            throw error;
        }
    },

    // Método existente: Eliminar un scroll
    delete: async (id) => {
        try {
            console.log(`[Model] Inicia delete para ID: ${id}`);
            const [result] = await pool.query('DELETE FROM scrolls WHERE id = ?', [id]);
            console.log('[Model] Resultado DB delete (affectedRows):', result.affectedRows);
            return result;
        } catch (error) {
            console.error('[Model] ERROR en la query DELETE:', error);
            throw error;
        }
    },

    // --- NUEVOS MÉTODOS PARA PAGINACIÓN Y BÚSQUEDA ---

    /**
     * Cuenta el número total de pergaminos en la base de datos.
     * @returns {Promise<Array>} Un array con un objeto que contiene el conteo.
     */
    countAll: async () => {
        try {
            const [rows] = await pool.query('SELECT COUNT(*) as count FROM scrolls');
            return rows;
        } catch (error) {
            console.error('Error counting all scrolls in model:', error);
            throw error;
        }
    },

    /**
     * Obtiene una lista de pergaminos con paginación.
     * Incluye el nombre del gato asociado.
     * @param {number} limit - El número máximo de resultados a devolver.
     * @param {number} offset - El número de filas a omitir antes de empezar a devolver filas.
     * @returns {Promise<Array>} Un array de objetos de pergaminos.
     */
    getAllPaginated: async (limit, offset) => {
        try {
            const [rows] = await pool.query(
                `SELECT s.*, c.name AS cat_name
                FROM scrolls s
                LEFT JOIN cats c ON s.cat_id = c.id
                ORDER BY s.id ASC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching all scrolls paginated in model:', error);
            throw error;
        }
    },

    /**
     * Cuenta el número de pergaminos que coinciden con un término de búsqueda en el título.
     * @param {string} title - El término de búsqueda para el título del pergamino.
     * @returns {Promise<Array>} Un array con un objeto que contiene el conteo de resultados.
     */
    countSearchResults: async (title) => {
        try {
            const [rows] = await pool.query(
                'SELECT COUNT(*) as count FROM scrolls WHERE title LIKE ?',
                [`%${title}%`]
            );
            return rows;
        } catch (error) {
            console.error('Error counting scroll search results in model:', error);
            throw error;
        }
    },

    /**
     * Busca pergaminos por título con paginación.
     * Incluye el nombre del gato asociado.
     * @param {string} title - El término de búsqueda para el título del pergamino.
     * @param {number} limit - El número máximo de resultados a devolver.
     * @param {number} offset - El número de filas a omitir antes de empezar a devolver filas.
     * @returns {Promise<Array>} Un array de objetos de pergaminos que coinciden con la búsqueda.
     */
    searchByTitlePaginated: async (title, limit, offset) => {
        try {
            const [rows] = await pool.query(
                `SELECT s.*, c.name AS cat_name
                FROM scrolls s
                LEFT JOIN cats c ON s.cat_id = c.id
                WHERE s.title LIKE ?
                ORDER BY s.id ASC
                LIMIT ? OFFSET ?`,
                [`%${title}%`, limit, offset]
            );
            return rows;
        } catch (error) {
            console.error('Error searching scrolls by title paginated in model:', error);
            throw error;
        }
    }
};

module.exports = Scroll;