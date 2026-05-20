const SeasonService = require("../services/seasonService");
const { success, error } = require("../utils/response");

class SeasonController {
  // CREATE
  async create(req, res) {
    try {
      const { year, description } = req.body;

      const season = await SeasonService.createSeason({
        year,
        description,
      });

      return success(res, season, "Temporada criada com sucesso", 201);
    } catch (err) {
      return error(res, err.message, 400);
    }
  }

  // READ - listar todos
  async getAll(req, res) {
    try {
      const seasons = await SeasonService.getAllSeasons();
      return success(res, seasons, "Temporadas listadas com sucesso");
    } catch (err) {
      return error(res, "Erro ao buscar temporadas", 500);
    }
  }

  // READ - buscar por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const season = await SeasonService.getSeasonById(id);
      return success(res, season, "Temporada encontrada");
    } catch (err) {
      return error(res, err.message, 404);
    }
  }

  // UPDATE
  async update(req, res) {
    try {
      const { id } = req.params;
      const { year, description } = req.body;

      const season = await SeasonService.updateSeason(id, {
        year,
        description,
      });

      return success(res, season, "Temporada atualizada com sucesso");
    } catch (err) {
      return error(res, err.message, 400);
    }
  }

  // DELETE
  async delete(req, res) {
    try {
      const { id } = req.params;
      await SeasonService.deleteSeason(id);
      return success(res, null, "Temporada deletada com sucesso");
    } catch (err) {
      return error(res, err.message, 400);
    }
  }
}

module.exports = new SeasonController();
