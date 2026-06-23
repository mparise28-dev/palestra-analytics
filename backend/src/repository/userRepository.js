const pool = require("../config/database");

class UserRepository {
  // CREATE - criar usuário (com password_hash agora)
  async create(user) {
    const { name, email, password_hash } = user;

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at`,
      [name, email, password_hash],
    );

    return result.rows[0];
  }

  // READ - listar todos
  async findAll() {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users",
    );
    return result.rows;
  }

  // READ - buscar por ID
  async findById(id) {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0];
  }

  // NOVO - buscar por email (sem senha, pra perfil)
  async findByEmail(email) {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE email = $1",
      [email],
    );
    return result.rows[0];
  }

  // NOVO - buscar por email com senha (pra login)
  async findByEmailWithPassword(email) {
    const result = await pool.query(
      "SELECT id, name, email, role, password_hash, created_at FROM users WHERE email = $1",
      [email],
    );
    return result.rows[0];
  }

  // UPDATE - atualizar usuário
  async update(id, user) {
    const { name, email } = user;

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2
       WHERE id = $3
       RETURNING id, name, email, role`,
      [name, email, id],
    );

    return result.rows[0];
  }

  // DELETE - remover usuário
  async delete(id) {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return true;
  }
}

module.exports = new UserRepository();
