const express = require("express");
const router = express.Router();
const PlayerController = require("../controllers/playerController");
const { authenticate, isAdmin } = require("../middlewares/auth");

// Rotas públicas (leituras)
router.get("/players", (req, res) => PlayerController.getAll(req, res));
router.get("/players/:id", (req, res) => PlayerController.getById(req, res));

// Rotas administrativas (escrita - precisa de token e admin)
router.post("/players", authenticate, isAdmin, (req, res) =>
  PlayerController.create(req, res),
);
router.put("/players/:id", authenticate, isAdmin, (req, res) =>
  PlayerController.update(req, res),
);
router.delete("/players/:id", authenticate, isAdmin, (req, res) =>
  PlayerController.delete(req, res),
);

module.exports = router;
