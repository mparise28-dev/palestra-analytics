const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");
const { authenticate, isAdmin } = require("../middlewares/auth"); // ← AQUI MUDA

// Rotas públicas (qualquer um pode ver)
router.get("/", statisticsController.getAll);
router.get("/:id", statisticsController.getById);
router.get("/players/:playerId", statisticsController.getByPlayer);
router.get("/matches/:matchId", statisticsController.getByMatch);
router.get("/ranking/goals", statisticsController.getGoalRanking);
router.get("/ranking/assists", statisticsController.getAssistRanking);
router.get("/team/summary", statisticsController.getTeamStats);

// Rotas protegidas (apenas admin)
router.post("/", authenticate, isAdmin, statisticsController.create); // ← authenticate
router.put("/:id", authenticate, isAdmin, statisticsController.update); // ← authenticate
router.delete("/:id", authenticate, isAdmin, statisticsController.delete); // ← authenticate

module.exports = router;
