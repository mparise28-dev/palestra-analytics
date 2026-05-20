const PlayerService = require("../services/playerService");
const { success, error } = require("../utils/response");

class PlayerController {
  // CREATE
  async create(req, res) {
    try {
      const { name, position, number, age, nationality } = req.body;

      const player = await PlayerService.createPlayer({
        name,
        position,
        number,
        age,
        nationality,
      });

      return success(res, player, "Jogador criado com sucesso", 201);
    } catch (err) {
      return error(res, err.message, 400);
    }
  }

  // READ - listar todos
  async getAll(req, res) {
    try {
      const players = await PlayerService.getAllPlayers();
      return success(res, players, "Jogadores listados com sucesso");
    } catch (err) {
      return error(res, "Erro ao buscar jogadores", 500);
    }
  }

  // READ - buscar por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const player = await PlayerService.getPlayerById(id);
      return success(res, player, "Jogador encontrado");
    } catch (err) {
      return error(res, err.message, 404);
    }
  }

  // UPDATE
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, position, number, age, nationality } = req.body;

      const player = await PlayerService.updatePlayer(id, {
        name,
        position,
        number,
        age,
        nationality,
      });

      return success(res, player, "Jogador atualizado com sucesso");
    } catch (err) {
      return error(res, err.message, 400);
    }
  }

  // DELETE
  async delete(req, res) {
    try {
      const { id } = req.params;
      await PlayerService.deletePlayer(id);
      return success(res, null, "Jogador deletado com sucesso");
    } catch (err) {
      return error(res, err.message, 400);
    }
  }
}

module.exports = new PlayerController();
