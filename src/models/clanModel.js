const pool = require('../../config/db');

const Clan = {
    getAll: async () => {
        console.log('[Model] Obteniendo todos los clanes...');
        const [rows] = await pool.query('SELECT * FROM clans');
        console.log(`[Model] Clanes encontrados: ${rows.length}`);
        return rows;
    },
    getById: async (id) => {
        console.log(`[Model] Obteniendo clan por ID: ${id}`);
        const [rows] = await pool.query('SELECT * FROM clans WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (clan) => {
        const { name, description } = clan;
        console.log('[Model] Creando nuevo clan con datos:', name);
        const [result] = await pool.query(
            'INSERT INTO clans (name, description) VALUES (?, ?)',
            [name, description]
        );
        console.log('[Model] Clan creado, ID:', result.insertId);
        return result.insertId;
    },
    // Función update con retorno de resultado y logs
    update: async (id, clan) => {
        const { name, description } = clan;
        console.log(`[Model] Inicia UPDATE para clan ID: ${id} con datos:`, clan);
        const [result] = await pool.query(
            'UPDATE clans SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        console.log('[Model] Resultado DB UPDATE (affectedRows):', result.affectedRows);
        return result; // <--- ¡Importante! Retorna el resultado para que el controlador lo use
    },
    // Función delete con retorno de resultado y logs
    delete: async (id) => {
        try {
            console.log(`[Model] Inicia DELETE para clan ID: ${id}`);
            const [result] = await pool.query('DELETE FROM clans WHERE id = ?', [id]);
            console.log('[Model] Resultado DB DELETE (affectedRows):', result.affectedRows);
            return result; // <--- ¡Importante! Retorna el resultado para que el controlador lo use
        } catch (error) {
            console.error('[Model] ERROR en la query DELETE de clan:', error);
            throw error; // Re-lanza el error para que el controlador lo capture
        }
    }
};

module.exports = Clan;