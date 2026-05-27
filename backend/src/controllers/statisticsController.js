const statisticsService = require("../services/statisticsService");
const { successResponse, errorResponse } = require("../utils/response"); 

const statisticsController = {
  // GET /api/statistics
  async getAll(req, res, next) {
    try {
      const statistics = await statisticsService.getAllStatistics();
      return successResponse(
        res,
        statistics,
        "Estatísticas recuperadas com sucesso",
      );
    } catch (error) {
      next(error);
    }
  },

  // GET /api/statistics/:id
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const statistic = await statisticsService.getStatisticsById(id);
      return successResponse(res, statistic, "Estatística encontrada");
    } catch (error) {
      next(error);
    }
  },

  // GET /api/statistics/players/:playerId
  async getByPlayer(req, res, next) {
    try {
      const { playerId } = req.params;
      const statistics =
        await statisticsService.getStatisticsByPlayerId(playerId);
      return successResponse(
        res,
        statistics,
        "Estatísticas do jogador recuperadas",
      );
    } catch (error) {
      next(error);
    }
  },

  // GET /api/statistics/matches/:matchId
  async getByMatch(req, res, next) {
    try {
      const { matchId } = req.params;
      const statistics =
        await statisticsService.getStatisticsByMatchId(matchId);
      return successResponse(
        res,
        statistics,
        "Estatísticas da partida recuperadas",
      );
    } catch (error) {
      next(error);
    }
  },

  // GET /api/statistics/ranking/goals?limit=10
  async getGoalRanking(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const ranking = await statisticsService.getGoalRanking(limit);
      return successResponse(res, ranking, "Ranking de artilheiros");
    } catch (error) {
      next(error);
    }
  },

  // GET /api/statistics/ranking/assists?limit=10
  async getAssistRanking(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const ranking = await statisticsService.getAssistRanking(limit);
      return successResponse(res, ranking, "Ranking de assistências");
    } catch (error) {
      next(error);
    }
  },

  // GET /api/statistics/team/summary
  async getTeamStats(req, res, next) {
    try {
      const stats = await statisticsService.getTeamStats();
      return successResponse(res, stats, "Estatísticas do time");
    } catch (error) {
      next(error);
    }
  },

  // POST /api/statistics (admin only)
  async create(req, res, next) {
    try {
      const { player_id, match_id, goals, assists, yellow_cards, red_cards } =
        req.body;

      if (!player_id || !match_id) {
        return errorResponse(res, "player_id e match_id são obrigatórios", 400);
      }

      const statistic = await statisticsService.createStatistics({
        player_id,
        match_id,
        goals,
        assists,
        yellow_cards,
        red_cards,
      });

      return successResponse(
        res,
        statistic,
        "Estatística criada com sucesso",
        201,
      );
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/statistics/:id (admin only)
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { goals, assists, yellow_cards, red_cards } = req.body;

      const updated = await statisticsService.updateStatistics(id, {
        goals,
        assists,
        yellow_cards,
        red_cards,
      });

      return successResponse(
        res,
        updated,
        "Estatística atualizada com sucesso",
      );
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/statistics/:id (admin only)
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await statisticsService.deleteStatistics(id);
      return successResponse(res, null, "Estatística removida com sucesso");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = statisticsController;
