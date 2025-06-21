const pool = require('../../config/db');

const Clan = {
    // Método existente: Obtener todos los clanes (este método no será el principal para la lista ahora, usaremos el paginado)
    getAll: async () => {
        try {
            console.log('[Model] Obteniendo todos los clanes...');
            const [rows] = await pool.query('SELECT * FROM clans ORDER BY id ASC');
            console.log(`[Model] Clanes encontrados: ${rows.length}`);
            return rows;
        } catch (error) {
            console.error('Error en Clan.getAll:', error);
            throw error;
        }
    },
    // Método existente: Obtener un clan por ID
    getById: async (id) => {
        try {
            console.log(`[Model] Obteniendo clan por ID: ${id}`);
            const [rows] = await pool.query('SELECT * FROM clans WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en Clan.getById:', error);
            throw error;
        }
    },
    // Método existente: Crear un nuevo clan
    create: async (clan) => {
        try {
            const { name, description } = clan;
            console.log('[Model] Creando nuevo clan con datos:', name);
            const [result] = await pool.query(
                'INSERT INTO clans (name, description) VALUES (?, ?)',
                [name, description]
            );
            console.log('[Model] Clan creado, ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Error en Clan.create:', error);
            throw error;
        }
    },
    // Función update con retorno de resultado y logs
    update: async (id, clan) => {
        try {
            const { name, description } = clan;
            console.log(`[Model] Inicia UPDATE para clan ID: ${id} con datos:`, clan);
            const [result] = await pool.query(
                'UPDATE clans SET name = ?, description = ? WHERE id = ?',
                [name, description, id]
            );
            console.log('[Model] Resultado DB UPDATE (affectedRows):', result.affectedRows);
            return result;
        } catch (error) {
            console.error('Error en Clan.update:', error);
            throw error;
        }
    },
    // Función delete con retorno de resultado y logs
    delete: async (id) => {
        try {
            console.log(`[Model] Inicia DELETE para clan ID: ${id}`);
            const [result] = await pool.query('DELETE FROM clans WHERE id = ?', [id]);
            console.log('[Model] Resultado DB DELETE (affectedRows):', result.affectedRows);
            return result;
        } catch (error) {
            console.error('[Model] ERROR en la query DELETE de clan:', error);
            // Error específico si el clan tiene miembros asociados (FK constraint)
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                const customError = new Error('No se puede eliminar el clan porque tiene gatos asociados. Primero reasigna o elimina los gatos de este clan.');
                customError.code = 'ER_ROW_IS_REFERENCED_2'; // Mantener el código de error para que el controlador lo capture
                throw customError;
            }
            throw error; // Re-lanza cualquier otro error
        }
    },

    // --- NUEVOS MÉTODOS PARA PAGINACIÓN, BÚSQUEDA Y CONTEO DE MIEMBROS ---

    /**
     * Cuenta el número total de clanes en la base de datos.
     * @returns {Promise<Array>} Un array con un objeto que contiene el conteo.
     */
    countAll: async () => {
        try {
            // Contar el número de clanes totales (no de miembros)
            const [rows] = await pool.query('SELECT COUNT(*) as count FROM clans');
            return rows;
        } catch (error) {
            console.error('Error counting all clans in model:', error);
            throw error;
        }
    },

    /**
     * Obtiene una lista de clanes con paginación, incluyendo el número de miembros.
     * @param {number} limit - El número máximo de resultados a devolver.
     * @param {number} offset - El número de filas a omitir antes de empezar a devolver filas.
     * @returns {Promise<Array>} Un array de objetos de clanes con la propiedad member_count.
     */
    getAllPaginated: async (limit, offset) => {
        try {
            const [rows] = await pool.query(
                `SELECT c.*, COUNT(cat.id) as member_count
                FROM clans c
                LEFT JOIN cats cat ON c.id = cat.clan_id
                GROUP BY c.id
                ORDER BY c.id ASC
                LIMIT ? OFFSET ?`,
                [limit, offset]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching all clans paginated in model:', error);
            throw error;
        }
    },

    /**
     * Cuenta el número de clanes que coinciden con un término de búsqueda en el nombre.
     * @param {string} name - El término de búsqueda para el nombre del clan.
     * @returns {Promise<Array>} Un array con un objeto que contiene el conteo de resultados.
     */
    countSearchResults: async (name) => {
        try {
            const [rows] = await pool.query(
                'SELECT COUNT(*) as count FROM clans WHERE name LIKE ?',
                [`%${name}%`]
            );
            return rows;
        } catch (error) {
            console.error('Error counting clan search results in model:', error);
            throw error;
        }
    },

    /**
     * Busca clanes por nombre con paginación, incluyendo el número de miembros.
     * @param {string} name - El término de búsqueda para el nombre del clan.
     * @param {number} limit - El número máximo de resultados a devolver.
     * @param {number} offset - El número de filas a omitir antes de empezar a devolver filas.
     * @returns {Promise<Array>} Un array de objetos de clanes que coinciden con la búsqueda.
     */
    searchByNamePaginated: async (name, limit, offset) => {
        try {
            const [rows] = await pool.query(
                `SELECT c.*, COUNT(cat.id) as member_count
                FROM clans c
                LEFT JOIN cats cat ON c.id = cat.clan_id
                WHERE c.name LIKE ?
                GROUP BY c.id
                ORDER BY c.id ASC
                LIMIT ? OFFSET ?`,
                [`%${name}%`, limit, offset]
            );
            return rows;
        } catch (error) {
            console.error('Error searching clans by name paginated in model:', error);
            throw error;
        }
    }
};

module.exports = Clan;