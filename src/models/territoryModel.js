const pool = require('../../config/db');

const Territory = {
    getAll: async () => {
        console.log('[Model] Obteniendo todos los territorios...');
        const [rows] = await pool.query('SELECT * FROM territories');
        console.log(`[Model] Territorios encontrados: ${rows.length}`);
        return rows;
    },
    getById: async (id) => {
        console.log(`[Model] Obteniendo territorio por ID: ${id}`);
        const [rows] = await pool.query('SELECT * FROM territories WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (territory) => {
        const { name, description } = territory;
        console.log('[Model] Creando nuevo territorio con datos:', name);
        const [result] = await pool.query(
            'INSERT INTO territories (name, description) VALUES (?, ?)',
            [name, description]
        );
        console.log('[Model] Territorio creado, ID:', result.insertId);
        return result.insertId;
    },
    update: async (id, territory) => {
        const { name, description } = territory;
        console.log(`[Model] Inicia UPDATE para territorio ID: ${id} con datos:`, territory);
        const [result] = await pool.query(
            'UPDATE territories SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        console.log('[Model] Resultado DB UPDATE (affectedRows):', result.affectedRows);
        return result; // ¡Correcto! Devuelve el resultado
    },
    delete: async (id) => {
        try {
            console.log(`[Model] Inicia DELETE para territorio ID: ${id}`);
            const [result] = await pool.query('DELETE FROM territories WHERE id = ?', [id]);
            console.log('[Model] Resultado DB DELETE (affectedRows):', result.affectedRows);
            return result; // ¡Correcto! Devuelve el resultado
        } catch (error) {
            console.error('[Model] ERROR en la query DELETE de territorio:', error);
            throw error;
        }
    }
};

module.exports = Territory;