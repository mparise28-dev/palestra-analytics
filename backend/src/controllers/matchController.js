// src/controllers/matchController.js
const matchService = require("../services/matchService");
const responseFormatter = require("../utils/responseFormatter");

class matchController {
  async getAll(req, res, next) {
    try {
      const filters = {
        season_id: req.query.season_id,
        home_team: req.query.home_team,
        away_team: req.query.away_team,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
      };

      const matches = await matchService.getAllMatches(filters);
      res.json(
        responseFormatter.success(matches, "Partidas listadas com sucesso"),
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const match = await matchService.getMatchById(req.params.id);
      res.json(responseFormatter.success(match, "Partida encontrada"));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const match = await matchService.createMatch(req.body);
      res
        .status(201)
        .json(responseFormatter.success(match, "Partida criada com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const match = await matchService.updateMatch(req.params.id, req.body);
      res.json(
        responseFormatter.success(match, "Partida atualizada com sucesso"),
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await matchService.deleteMatch(req.params.id);
      res.json(responseFormatter.success(null, "Partida excluída com sucesso"));
    } catch (error) {
      next(error);
    }
  }

  async getBySeason(req, res, next) {
    try {
      const matches = await matchService.getMatchesBySeason(
        req.params.seasonId,
      );
      res.json(
        responseFormatter.success(
          matches,
          "Partidas da temporada listadas com sucesso",
        ),
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new matchController();
