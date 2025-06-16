const pool = require('../../config/db');

const Clan = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM clans');
    return rows;
  },
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM clans WHERE id = ?', [id]);
    return rows[0];
  },
  create: async (clan) => {
    const { name, description } = clan;
    const [result] = await pool.query(
      'INSERT INTO clans (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result.insertId;
  },
  update: async (id, clan) => {
    const { name, description } = clan;
    await pool.query(
      'UPDATE clans SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
  },
  delete: async (id) => {
    await pool.query('DELETE FROM clans WHERE id = ?', [id]);
  }
};

module.exports = Clan;