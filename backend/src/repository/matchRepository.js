// src/repositories/matchRepository.js
const pool = require("../config/database");

class matchRepository {
  async findAll(filters = {}) {
    let query = `
      SELECT m.*, s.year as season_year 
      FROM matches m
      JOIN seasons s ON m.season_id = s.id
      WHERE 1=1
    `;
    const values = [];
    let idx = 1;

    if (filters.season_id) {
      query += ` AND m.season_id = $${idx++}`;
      values.push(filters.season_id);
    }

    if (filters.home_team) {
      query += ` AND LOWER(m.home_team) LIKE $${idx++}`;
      values.push(`%${filters.home_team.toLowerCase()}%`);
    }

    if (filters.away_team) {
      query += ` AND LOWER(m.away_team) LIKE $${idx++}`;
      values.push(`%${filters.away_team.toLowerCase()}%`);
    }

    if (filters.start_date) {
      query += ` AND m.match_date >= $${idx++}`;
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ` AND m.match_date <= $${idx++}`;
      values.push(filters.end_date);
    }

    query += ` ORDER BY m.match_date DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  async findById(id) {
    const query = `
      SELECT m.*, s.year as season_year 
      FROM matches m
      JOIN seasons s ON m.season_id = s.id
      WHERE m.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async create(data) {
    const query = `
      INSERT INTO matches (season_id, home_team, away_team, match_date, home_score, away_score, stadium, referee, attendance)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      data.season_id,
      data.home_team,
      data.away_team,
      data.match_date,
      data.home_score || 0,
      data.away_score || 0,
      data.stadium || null,
      data.referee || null,
      data.attendance || 0,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.season_id !== undefined) {
      fields.push(`season_id = $${idx++}`);
      values.push(data.season_id);
    }
    if (data.home_team !== undefined) {
      fields.push(`home_team = $${idx++}`);
      values.push(data.home_team);
    }
    if (data.away_team !== undefined) {
      fields.push(`away_team = $${idx++}`);
      values.push(data.away_team);
    }
    if (data.match_date !== undefined) {
      fields.push(`match_date = $${idx++}`);
      values.push(data.match_date);
    }
    if (data.home_score !== undefined) {
      fields.push(`home_score = $${idx++}`);
      values.push(data.home_score);
    }
    if (data.away_score !== undefined) {
      fields.push(`away_score = $${idx++}`);
      values.push(data.away_score);
    }
    if (data.stadium !== undefined) {
      fields.push(`stadium = $${idx++}`);
      values.push(data.stadium);
    }
    if (data.referee !== undefined) {
      fields.push(`referee = $${idx++}`);
      values.push(data.referee);
    }
    if (data.attendance !== undefined) {
      fields.push(`attendance = $${idx++}`);
      values.push(data.attendance);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE matches SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const query = "DELETE FROM matches WHERE id = $1 RETURNING id";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findBySeason(seasonId) {
    const query = `
      SELECT m.*, s.year as season_year 
      FROM matches m
      JOIN seasons s ON m.season_id = s.id
      WHERE m.season_id = $1
      ORDER BY m.match_date DESC
    `;
    const result = await pool.query(query, [seasonId]);
    return result.rows;
  }
}

module.exports = new matchRepository();
