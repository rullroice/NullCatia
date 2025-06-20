const pool = require('../../config/db');

const Cat = {
    getAll: async () => {
        const [rows] = await pool.query(
            `SELECT cats.*, clans.name AS clan_name, territories.name AS territory_name
            FROM cats
            LEFT JOIN clans ON cats.clan_id = clans.id
            LEFT JOIN territories ON cats.territory_id = territories.id`
        );
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM cats WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (cat) => {
        // CAMBIO A 'birth_date' aquí para que coincida con el nombre de la columna en la BD y en las vistas
        const { name, clan_id, territory_id, birth_date } = cat;
        const [result] = await pool.query(
            'INSERT INTO cats (name, clan_id, territory_id, birth_date) VALUES (?, ?, ?, ?)',
            [name, clan_id, territory_id, birth_date]
        );
        return result.insertId;
    },
    update: async (id, cat) => {
        // CAMBIO A 'birth_date' aquí también para consistencia
        const { name, clan_id, territory_id, birth_date } = cat;
        const [result] = await pool.query(
            'UPDATE cats SET name = ?, clan_id = ?, territory_id = ?, birth_date = ? WHERE id = ?',
            [name, clan_id, territory_id, birth_date, id]
        );
        return result; // <-- Devolver el resultado de la consulta
    },
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM cats WHERE id = ?', [id]);
        return result; // <-- Devolver el resultado de la consulta
    },
};

module.exports = Cat;