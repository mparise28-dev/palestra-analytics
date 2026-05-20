const SeasonRepository = require("../repository/seasonRepository");

class SeasonService {
  async createSeason(data) {
    const { year, description } = data;

    // Validações
    if (!year) {
      throw new Error("Ano é obrigatório");
    }

    if (year < 1900 || year > 2100) {
      throw new Error("Ano inválido (deve estar entre 1900 e 2100)");
    }

    if (description && description.length > 255) {
      throw new Error("Descrição muito longa (máx 255 caracteres)");
    }

    // Verifica se já existe uma temporada com esse ano
    const existingSeasons = await SeasonRepository.findAll();
    const yearExists = existingSeasons.some((s) => s.year === year);

    if (yearExists) {
      throw new Error(`Já existe uma temporada para o ano ${year}`);
    }

    const season = await SeasonRepository.create({
      year,
      description: description || null,
    });

    return season;
  }

  async getAllSeasons() {
    return await SeasonRepository.findAll();
  }

  async getSeasonById(id) {
    const seasonId = parseInt(id);

    if (isNaN(seasonId)) {
      throw new Error("ID inválido");
    }

    const season = await SeasonRepository.findById(seasonId);

    if (!season) {
      throw new Error("Temporada não encontrada");
    }

    return season;
  }

  async updateSeason(id, data) {
    const seasonId = parseInt(id);

    if (isNaN(seasonId)) {
      throw new Error("ID inválido");
    }

    const existingSeason = await SeasonRepository.findById(seasonId);

    if (!existingSeason) {
      throw new Error("Temporada não encontrada");
    }

    const updateData = {
      year: data.year !== undefined ? data.year : existingSeason.year,
      description:
        data.description !== undefined
          ? data.description
          : existingSeason.description,
    };

    // Validações
    if (updateData.year && (updateData.year < 1900 || updateData.year > 2100)) {
      throw new Error("Ano inválido (deve estar entre 1900 e 2100)");
    }

    // Verifica se o novo ano já não está em outra temporada
    if (updateData.year !== existingSeason.year) {
      const allSeasons = await SeasonRepository.findAll();
      const yearExists = allSeasons.some(
        (s) => s.year === updateData.year && s.id !== seasonId,
      );

      if (yearExists) {
        throw new Error(
          `Já existe uma temporada para o ano ${updateData.year}`,
        );
      }
    }

    if (updateData.description && updateData.description.length > 255) {
      throw new Error("Descrição muito longa (máx 255 caracteres)");
    }

    const season = await SeasonRepository.update(seasonId, updateData);

    return season;
  }

  async deleteSeason(id) {
    const seasonId = parseInt(id);

    if (isNaN(seasonId)) {
      throw new Error("ID inválido");
    }

    const season = await SeasonRepository.findById(seasonId);

    if (!season) {
      throw new Error("Temporada não encontrada");
    }

    return await SeasonRepository.delete(seasonId);
  }
}

module.exports = new SeasonService();
