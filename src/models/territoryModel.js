const pool = require('../../config/db');

const Territory = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM territories');
    return rows;
  },
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM territories WHERE id = ?', [id]);
    return rows[0];
  },
  create: async (territory) => {
    const { name, type, description } = territory;
    const [result] = await pool.query(
      'INSERT INTO territories (name, type, description) VALUES (?, ?, ?)',
      [name, type, description]
    );
    return result.insertId;
  },
  update: async (id, territory) => {
    const { name, type, description } = territory;
    await pool.query(
      'UPDATE territories SET name = ?, type = ?, description = ? WHERE id = ?',
      [name, type, description, id]
    );
  },
  delete: async (id) => {
    await pool.query('DELETE FROM territories WHERE id = ?', [id]);
  }
};

module.exports = Territory;