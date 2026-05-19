// backend/src/repositories/userRepository.js

const pool = require("../config/database");

class userRepository {
  async create(user) {
    const { name, email, password } = user;

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, password],
    );

    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users",
    );

    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [id],
    );

    return result.rows[0];
  }

  async update(id, user) {
    const { name, email } = user;

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2
       WHERE id = $3
       RETURNING id, name, email`,
      [name, email, id],
    );

    return result.rows[0];
  }

  async delete(id) {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    return true;
  }
}

module.exports = new userRepository();
