const pool = require('../../config/db');

const Scroll = {
    getAll: async () => {
        const [rows] = await pool.query(
            'SELECT s.*, c.name AS cat_name FROM scrolls s LEFT JOIN cats c ON s.cat_id = c.id'
        );
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM scrolls WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (scroll) => {
        const { cat_id, title, content } = scroll;
        const [result] = await pool.query(
            'INSERT INTO scrolls (cat_id, title, content) VALUES (?, ?, ?)',
            [cat_id, title, content]
        );
        return result.insertId;
    },
    update: async (id, scroll) => {
        const { title, content, cat_id } = scroll;
        const [result] = await pool.query(
            'UPDATE scrolls SET title = ?, content = ?, cat_id = ? WHERE id = ?',
            [title, content, cat_id, id]
        );
        return result; // <-- Devuelve el resultado de la consulta
    },
    delete: async (id) => {
        try {
            console.log(`[Model] Inicia delete para ID: ${id}`); // Log de entrada al modelo
            const [result] = await pool.query('DELETE FROM scrolls WHERE id = ?', [id]);
            console.log('[Model] Resultado DB delete (affectedRows):', result.affectedRows); // Muestra affectedRows
            return result; // ¡Importante! Devuelve el resultado de la operación SQL
        } catch (error) {
            console.error('[Model] ERROR en la query DELETE:', error); // Log el error completo
            throw error; // Re-lanza el error para que el controlador lo capture
        }
    },
};

module.exports = Scroll;