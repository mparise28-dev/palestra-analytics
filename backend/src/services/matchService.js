// src/services/matchService.js
const matchRepository = require("../repository/matchRepository");
const seasonRepository = require("../repository/seasonRepository");

class MatchService {
  async getAllMatches(filters) {
    const matches = await matchRepository.findAll(filters);
    return matches;
  }

  async getMatchById(id) {
    const match = await matchRepository.findById(id);
    if (!match) {
      const error = new Error("Partida não encontrada");
      error.statusCode = 404;
      throw error;
    }
    return match;
  }

  async createMatch(data) {
    // Validações
    if (!data.season_id) {
      const error = new Error("ID da temporada é obrigatório");
      error.statusCode = 400;
      throw error;
    }

    if (!data.home_team || !data.away_team) {
      const error = new Error("Times mandante e visitante são obrigatórios");
      error.statusCode = 400;
      throw error;
    }

    if (!data.match_date) {
      const error = new Error("Data da partida é obrigatória");
      error.statusCode = 400;
      throw error;
    }

    // Verificar se a temporada existe
    const season = await seasonRepository.findById(data.season_id);
    if (!season) {
      const error = new Error("Temporada não encontrada");
      error.statusCode = 404;
      throw error;
    }

    // Validar se times são diferentes
    if (data.home_team === data.away_team) {
      const error = new Error(
        "Times mandante e visitante não podem ser iguais",
      );
      error.statusCode = 400;
      throw error;
    }

    const match = await matchRepository.create(data);
    return match;
  }

  async updateMatch(id, data) {
    // Verificar se a partida existe
    await this.getMatchById(id);

    // Se for atualizar season_id, verificar se a nova temporada existe
    if (data.season_id) {
      const season = await seasonRepository.findById(data.season_id);
      if (!season) {
        const error = new Error("Temporada não encontrada");
        error.statusCode = 404;
        throw error;
      }
    }

    // Validar se times são diferentes
    if (data.home_team && data.away_team && data.home_team === data.away_team) {
      const error = new Error(
        "Times mandante e visitante não podem ser iguais",
      );
      error.statusCode = 400;
      throw error;
    }

    const match = await matchRepository.update(id, data);
    return match;
  }

  async deleteMatch(id) {
    await this.getMatchById(id);
    const result = await matchRepository.delete(id);
    return result;
  }

  async getMatchesBySeason(seasonId) {
    const season = await seasonRepository.findById(seasonId);
    if (!season) {
      const error = new Error("Temporada não encontrada");
      error.statusCode = 404;
      throw error;
    }

    const matches = await matchRepository.findBySeason(seasonId);
    return matches;
  }
}

module.exports = new MatchService();
