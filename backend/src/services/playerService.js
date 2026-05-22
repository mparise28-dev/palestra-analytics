const PlayerRepository = require("../repository/playerRepository");

class PlayerService {
  async createPlayer(data) {
    const { name, position, number, age, nationality } = data;

    // Validações
    if (!name || name.trim().length < 2) {
      throw new Error(
        "Nome do jogador é obrigatório e deve ter no mínimo 2 caracteres",
      );
    }

    if (position && position.length > 50) {
      throw new Error("Posição muito longa (máx 50 caracteres)");
    }

    if (number && (number < 1 || number > 99)) {
      throw new Error("Número da camisa deve estar entre 1 e 99");
    }

    if (age && (age < 15 || age > 50)) {
      throw new Error("Idade deve estar entre 15 e 50 anos");
    }

    if (nationality && nationality.length > 50) {
      throw new Error("Nacionalidade muito longa (máx 50 caracteres)");
    }

    const player = await PlayerRepository.create({
      name: name.trim(),
      position: position || null,
      number: number || null,
      age: age || null,
      nationality: nationality || null,
    });

    return player;
  }

  async getAllPlayers() {
    return await PlayerRepository.findAll();
  }

  async getPlayerById(id) {
    const playerId = parseInt(id);

    if (isNaN(playerId)) {
      throw new Error("ID inválido");
    }

    const player = await PlayerRepository.findById(playerId);

    if (!player) {
      throw new Error("Jogador não encontrado");
    }

    return player;
  }

  async updatePlayer(id, data) {
    const playerId = parseInt(id);

    if (isNaN(playerId)) {
      throw new Error("ID inválido");
    }

    const existingPlayer = await PlayerRepository.findById(playerId);

    if (!existingPlayer) {
      throw new Error("Jogador não encontrado");
    }

    const updateData = {
      name: data.name !== undefined ? data.name.trim() : existingPlayer.name,
      position:
        data.position !== undefined ? data.position : existingPlayer.position,
      number: data.number !== undefined ? data.number : existingPlayer.number,
      age: data.age !== undefined ? data.age : existingPlayer.age,
      nationality:
        data.nationality !== undefined
          ? data.nationality
          : existingPlayer.nationality,
    };

    // Validações para atualização
    if (updateData.name && updateData.name.length < 2) {
      throw new Error("Nome deve ter no mínimo 2 caracteres");
    }

    if (
      updateData.number &&
      (updateData.number < 1 || updateData.number > 99)
    ) {
      throw new Error("Número da camisa deve estar entre 1 e 99");
    }

    if (updateData.age && (updateData.age < 15 || updateData.age > 50)) {
      throw new Error("Idade deve estar entre 15 e 50 anos");
    }

    const player = await PlayerRepository.update(playerId, updateData);

    return player;
  }

  async deletePlayer(id) {
    const playerId = parseInt(id);

    if (isNaN(playerId)) {
      throw new Error("ID inválido");
    }

    const player = await PlayerRepository.findById(playerId);

    if (!player) {
      throw new Error("Jogador não encontrado");
    }

    return await PlayerRepository.delete(playerId);
  }
}

module.exports = new PlayerService();
