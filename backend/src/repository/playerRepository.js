const pool = require("../config/database");

class PlayerRepository {
  // CREATE
  async create(player) {
    const { name, position, number, age, nationality } = player;

    const result = await pool.query(
      `INSERT INTO players (name, position, number, age, nationality)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, position, number, age, nationality],
    );

    return result.rows[0];
  }

  // READ - listar todos
  async findAll() {
    const result = await pool.query("SELECT * FROM players ORDER BY name");
    return result.rows;
  }

  // READ - buscar por ID
  async findById(id) {
    const result = await pool.query("SELECT * FROM players WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  // UPDATE
  async update(id, player) {
    const { name, position, number, age, nationality } = player;

    const result = await pool.query(
      `UPDATE players
       SET name = $1, position = $2, number = $3, age = $4, nationality = $5
       WHERE id = $6
       RETURNING *`,
      [name, position, number, age, nationality, id],
    );

    return result.rows[0];
  }

  // DELETE
  async delete(id) {
    await pool.query("DELETE FROM players WHERE id = $1", [id]);
    return true;
  }
}

module.exports = new PlayerRepository();
