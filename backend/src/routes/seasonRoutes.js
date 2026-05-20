const express = require("express");
const router = express.Router();
const SeasonController = require("../controllers/seasonController");
const { authenticate, isAdmin } = require("../middlewares/auth");

// Rotas públicas (leituras)
router.get("/seasons", (req, res) => SeasonController.getAll(req, res));
router.get("/seasons/:id", (req, res) => SeasonController.getById(req, res));

// Rotas administrativas (escrita - precisa de token e admin)
router.post("/seasons", authenticate, isAdmin, (req, res) =>
  SeasonController.create(req, res),
);
router.put("/seasons/:id", authenticate, isAdmin, (req, res) =>
  SeasonController.update(req, res),
);
router.delete("/seasons/:id", authenticate, isAdmin, (req, res) =>
  SeasonController.delete(req, res),
);

module.exports = router;
