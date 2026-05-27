const statisticsRepository = require("../repository/statisticsRepository");
const playerRepository = require("../repository/playerRepository");
const matchRepository = require("../repository/matchRepository");

const statisticsService = {
  // Criar estatística (com validações)
  async createStatistics(data) {
    const { player_id, match_id, goals, assists, yellow_cards, red_cards } =
      data;

    // Validar se jogador existe
    const player = await playerRepository.findById(player_id);
    if (!player) {
      throw new Error("Jogador não encontrado");
    }

    // Validar se partida existe
    const match = await matchRepository.findById(match_id);
    if (!match) {
      throw new Error("Partida não encontrada");
    }

    // Verificar se já existe estatística para esse jogador/partida
    const exists = await statisticsRepository.existsByPlayerAndMatch(
      player_id,
      match_id,
    );
    if (exists) {
      throw new Error("Estatística já existe para este jogador nesta partida");
    }

    const statistic = await statisticsRepository.create({
      player_id,
      match_id,
      goals: goals || 0,
      assists: assists || 0,
      yellow_cards: yellow_cards || 0,
      red_cards: red_cards || 0,
    });

    return statistic;
  },

  async getAllStatistics() {
    return await statisticsRepository.findAll();
  },

  async getStatisticsById(id) {
    const statistic = await statisticsRepository.findById(id);
    if (!statistic) {
      throw new Error("Estatística não encontrada");
    }
    return statistic;
  },

  async getStatisticsByPlayerId(playerId) {
    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw new Error("Jogador não encontrado");
    }
    return await statisticsRepository.findByPlayerId(playerId);
  },

  async getStatisticsByMatchId(matchId) {
    const match = await matchRepository.findById(matchId);
    if (!match) {
      throw new Error("Partida não encontrada");
    }
    return await statisticsRepository.findByMatchId(matchId);
  },

  async getGoalRanking(limit = 10) {
    return await statisticsRepository.getGoalRanking(limit);
  },

  async getAssistRanking(limit = 10) {
    return await statisticsRepository.getAssistRanking(limit);
  },

  async getTeamStats() {
    return await statisticsRepository.getTeamStats();
  },

  async updateStatistics(id, updates) {
    const existing = await statisticsRepository.findById(id);
    if (!existing) {
      throw new Error("Estatística não encontrada");
    }
    return await statisticsRepository.update(id, updates);
  },

  async deleteStatistics(id) {
    const existing = await statisticsRepository.findById(id);
    if (!existing) {
      throw new Error("Estatística não encontrada");
    }
    return await statisticsRepository.delete(id);
  },
};

module.exports = statisticsService;
