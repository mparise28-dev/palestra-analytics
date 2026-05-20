const pool = require("../config/database");

class SeasonRepository {
  // CREATE
  async create(season) {
    const { year, description } = season;

    const result = await pool.query(
      `INSERT INTO seasons (year, description)
       VALUES ($1, $2)
       RETURNING *`,
      [year, description],
    );

    return result.rows[0];
  }

  // READ - listar todos
  async findAll() {
    const result = await pool.query("SELECT * FROM seasons ORDER BY year DESC");
    return result.rows;
  }

  // READ - buscar por ID
  async findById(id) {
    const result = await pool.query("SELECT * FROM seasons WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  // UPDATE
  async update(id, season) {
    const { year, description } = season;

    const result = await pool.query(
      `UPDATE seasons
       SET year = $1, description = $2
       WHERE id = $3
       RETURNING *`,
      [year, description, id],
    );

    return result.rows[0];
  }

  // DELETE
  async delete(id) {
    await pool.query("DELETE FROM seasons WHERE id = $1", [id]);
    return true;
  }
}

module.exports = new SeasonRepository();
