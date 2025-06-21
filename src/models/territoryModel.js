const pool = require('../../config/db');

const Territory = {
    // Método existente: Obtener todos los territorios (este método no será el principal para la lista ahora, usaremos el paginado)
    getAll: async () => {
        try {
            console.log('[Model] Obteniendo todos los territorios...');
            const [rows] = await pool.query('SELECT * FROM territories ORDER BY id ASC');
            console.log(`[Model] Territorios encontrados: ${rows.length}`);
            return rows;
        } catch (error) {
            console.error('Error en Territory.getAll:', error);
            throw error;
        }
    },
    // Método existente: Obtener un territorio por ID
    getById: async (id) => {
        try {
            console.log(`[Model] Obteniendo territorio por ID: ${id}`);
            const [rows] = await pool.query('SELECT * FROM territories WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en Territory.getById:', error);
            throw error;
        }
    },
    // Método existente: Crear un nuevo territorio
    create: async (territory) => {
        try {
            const { name, description } = territory;
            console.log('[Model] Creando nuevo territorio con datos:', name);
            const [result] = await pool.query(
                'INSERT INTO territories (name, description) VALUES (?, ?)',
                [name, description]
            );
            console.log('[Model] Territorio creado, ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Error en Territory.create:', error);
            throw error;
        }
    },
    // Función update con retorno de resultado y logs
    update: async (id, territory) => {
        try {
            const { name, description } = territory;
            console.log(`[Model] Inicia UPDATE para territorio ID: ${id} con datos:`, territory);
            const [result] = await pool.query(
                'UPDATE territories SET name = ?, description = ? WHERE id = ?',
                [name, description, id]
            );
            console.log('[Model] Resultado DB UPDATE (affectedRows):', result.affectedRows);
            return result;
        } catch (error) {
            console.error('Error en Territory.update:', error);
            throw error;
        }
    },
    // Función delete con retorno de resultado y logs
    delete: async (id) => {
        try {
            console.log(`[Model] Inicia DELETE para territorio ID: ${id}`);
            const [result] = await pool.query('DELETE FROM territories WHERE id = ?', [id]);
            console.log('[Model] Resultado DB DELETE (affectedRows):', result.affectedRows);
            return result;
        } catch (error) {
            console.error('[Model] ERROR en la query DELETE de territorio:', error);
            // Error específico si el territorio tiene gatos asociados (FK constraint)
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                const customError = new Error('No se puede eliminar el territorio porque tiene gatos asociados. Primero reasigna o elimina los gatos de este territorio.');
                customError.code = 'ER_ROW_IS_REFERENCED_2'; // Mantener el código de error para que el controlador lo capture
                throw customError;
            }
            throw error; // Re-lanza cualquier otro error
        }
    },

    // --- NUEVOS MÉTODOS PARA PAGINACIÓN, BÚSQUEDA Y CONTEO DE GATOS ASOCIADOS ---

    /**
     * Cuenta el número total de territorios en la base de datos.
     * @returns {Promise<Array>} Un array con un objeto que contiene el conteo.
     */
    countAll: async () => {
        try {
            const [rows] = await pool.query('SELECT COUNT(*) as count FROM territories');
            return rows;
        } catch (error) {
            console.error('Error counting all territories in model:', error);
            throw error;
        }
    },

    /**
     * Obtiene una lista de territorios con paginación, incluyendo el número de gatitos asociados.
     * @param {number} limit - El número máximo de resultados a devolver.
     * @param {number} offset - El número de filas a omitir antes de empezar a devolver filas.
     * @returns {Promise<Array>} Un array de objetos de territorios con la propiedad cat_count.
     */
    getAllPaginated: async (limit, offset) => {
        try {
            const [rows] = await pool.query(
                `SELECT t.*, COUNT(cat.id) as cat_count
                FROM territories t
                LEFT JOIN cats cat ON t.id = cat.territory_id
                GROUP BY t.id
                ORDER BY t.id ASC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching all territories paginated in model:', error);
            throw error;
        }
    },

    /**
     * Cuenta el número de territorios que coinciden con un término de búsqueda en el nombre.
     * @param {string} name - El término de búsqueda para el nombre del territorio.
     * @returns {Promise<Array>} Un array con un objeto que contiene el conteo de resultados.
     */
    countSearchResults: async (name) => {
        try {
            const [rows] = await pool.query(
                'SELECT COUNT(*) as count FROM territories WHERE name LIKE ?',
                [`%${name}%`]
            );
            return rows;
        } catch (error) {
            console.error('Error counting territory search results in model:', error);
            throw error;
        }
    },

    /**
     * Busca territorios por nombre con paginación, incluyendo el número de gatitos asociados.
     * @param {string} name - El término de búsqueda para el nombre del territorio.
     * @param {number} limit - El número máximo de resultados a devolver.
     * @param {number} offset - El número de filas a omitir antes de empezar a devolver filas.
     * @returns {Promise<Array>} Un array de objetos de territorios que coinciden con la búsqueda.
     */
    searchByNamePaginated: async (name, limit, offset) => {
        try {
            const [rows] = await pool.query(
                `SELECT t.*, COUNT(cat.id) as cat_count
                FROM territories t
                LEFT JOIN cats cat ON t.id = cat.territory_id
                WHERE t.name LIKE ?
                GROUP BY t.id
                ORDER BY t.id ASC
                LIMIT ? OFFSET ?`,
                [`%${name}%`, limit, offset]
            );
            return rows;
        } catch (error) {
            console.error('Error searching territories by name paginated in model:', error);
            throw error;
        }
    }
};

module.exports = Territory;