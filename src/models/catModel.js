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
    const { name, clan_id, territory_id, birthdate } = cat;
    const [result] = await pool.query(
      'INSERT INTO cats (name, clan_id, territory_id, birthdate) VALUES (?, ?, ?, ?)',
      [name, clan_id, territory_id, birthdate]
    );
    return result.insertId;
  },
  update: async (id, cat) => {
    const { name, clan_id, territory_id, birthdate } = cat;
    await pool.query(
      'UPDATE cats SET name = ?, clan_id = ?, territory_id = ?, birthdate = ? WHERE id = ?',
      [name, clan_id, territory_id, birthdate, id]
    );
  },
  delete: async (id) => {
    await pool.query('DELETE FROM cats WHERE id = ?', [id]);
  }
};

module.exports = Cat;