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
    const { title, content } = scroll;
    await pool.query(
      'UPDATE scrolls SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );
  },
  delete: async (id) => {
    await pool.query('DELETE FROM scrolls WHERE id = ?', [id]);
  }
};

module.exports = Scroll;