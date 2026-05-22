// src/middlewares/validation.js
const validateMatch = (req, res, next) => {
  const {
    season_id,
    home_team,
    away_team,
    match_date,
    home_score,
    away_score,
  } = req.body;
  const errors = [];

  if (req.method !== "DELETE") {
    if (!season_id) errors.push("season_id é obrigatório");
    if (!home_team) errors.push("home_team é obrigatório");
    if (!away_team) errors.push("away_team é obrigatório");
    if (!match_date) errors.push("match_date é obrigatório");

    if (
      home_score !== undefined &&
      (home_score < 0 || !Number.isInteger(home_score))
    ) {
      errors.push("home_score deve ser um número inteiro positivo");
    }

    if (
      away_score !== undefined &&
      (away_score < 0 || !Number.isInteger(away_score))
    ) {
      errors.push("away_score deve ser um número inteiro positivo");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors,
    });
  }

  next();
};

module.exports = { validateMatch };
