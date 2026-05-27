const pool = require("../config/database");

const statisticsRepository = {
  // Criar estatística
  async create(statistic) {
    const { player_id, match_id, goals, assists, yellow_cards, red_cards } = statistic;
    const result = await pool.query(
      `INSERT INTO statistics (player_id, match_id, goals, assists, yellow_cards, red_cards)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [player_id, match_id, goals || 0, assists || 0, yellow_cards || 0, red_cards || 0]
    );
    return result.rows[0];
  },

  // Buscar todas estatísticas (com nomes do jogador e times da partida)
  async findAll() {
    const result = await pool.query(`
      SELECT s.*,
             p.name as player_name,
             p.position,
             m.home_team,
             m.away_team,
             m.match_date
      FROM statistics s
      JOIN players p ON s.player_id = p.id
      JOIN matches m ON s.match_id = m.id
      ORDER BY m.match_date DESC, s.goals DESC
    `);
    return result.rows;
  },

  // Buscar por ID
  async findById(id) {
    const result = await pool.query(`
      SELECT s.*,
             p.name as player_name,
             p.position,
             m.home_team,
             m.away_team,
             m.match_date
      FROM statistics s
      JOIN players p ON s.player_id = p.id
      JOIN matches m ON s.match_id = m.id
      WHERE s.id = $1
    `, [id]);
    return result.rows[0];
  },

  // Buscar estatísticas de um jogador específico
  async findByPlayerId(playerId) {
    const result = await pool.query(`
      SELECT s.*, m.home_team, m.away_team, m.match_date
      FROM statistics s
      JOIN matches m ON s.match_id = m.id
      WHERE s.player_id = $1
      ORDER BY m.match_date DESC
    `, [playerId]);
    return result.rows;
  },

  // Buscar estatísticas de uma partida específica
  async findByMatchId(matchId) {
    const result = await pool.query(`
      SELECT s.*, p.name as player_name, p.position, p.number
      FROM statistics s
      JOIN players p ON s.player_id = p.id
      WHERE s.match_id = $1
      ORDER BY s.goals DESC, s.assists DESC
    `, [matchId]);
    return result.rows;
  },

  // Ranking de artilheiros (geral)
  async getGoalRanking(limit = 10) {
    const result = await pool.query(`
      SELECT p.id, p.name, p.position, p.number,
             SUM(s.goals) as total_goals,
             SUM(s.assists) as total_assists,
             COUNT(DISTINCT s.match_id) as matches_played
      FROM statistics s
      JOIN players p ON s.player_id = p.id
      GROUP BY p.id
      ORDER BY total_goals DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  },

  // Ranking de assistências
  async getAssistRanking(limit = 10) {
    const result = await pool.query(`
      SELECT p.id, p.name, p.position, p.number,
             SUM(s.assists) as total_assists,
             SUM(s.goals) as total_goals,
             COUNT(DISTINCT s.match_id) as matches_played
      FROM statistics s
      JOIN players p ON s.player_id = p.id
      GROUP BY p.id
      ORDER BY total_assists DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  },

  // Estatísticas agregadas do time (total da temporada)
  async getTeamStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT s.match_id) as total_matches,
        SUM(s.goals) as total_goals,
        SUM(s.assists) as total_assists,
        SUM(s.yellow_cards) as total_yellow_cards,
        SUM(s.red_cards) as total_red_cards,
        (SELECT COUNT(*) FROM matches WHERE home_score > away_score OR away_score > home_score) as total_wins -- simplificado, ajuste depois
      FROM statistics s
    `);
    return result.rows[0];
  },

  // Atualizar estatística
  async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.goals !== undefined) {
      fields.push(`goals = $${idx++}`);
      values.push(updates.goals);
    }
    if (updates.assists !== undefined) {
      fields.push(`assists = $${idx++}`);
      values.push(updates.assists);
    }
    if (updates.yellow_cards !== undefined) {
      fields.push(`yellow_cards = $${idx++}`);
      values.push(updates.yellow_cards);
    }
    if (updates.red_cards !== undefined) {
      fields.push(`red_cards = $${idx++}`);
      values.push(updates.red_cards);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE statistics SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  // Deletar estatística
  async delete(id) {
    const result = await pool.query("DELETE FROM statistics WHERE id = $1 RETURNING id", [id]);
    return result.rows[0];
  },

  // Verificar se já existe estatística para um jogador em uma partida
  async existsByPlayerAndMatch(playerId, matchId) {
    const result = await pool.query(
      "SELECT id FROM statistics WHERE player_id = $1 AND match_id = $2",
      [playerId, matchId]
    );
    return result.rows.length > 0;
  }
};

module.exports = statisticsRepository;