const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController"); // ← CORRIGIDO
const { authenticate, isAdmin } = require("../middlewares/auth");

// Rotas públicas (qualquer um pode ver)
router.get("/", matchController.getAll);
router.get("/season/:seasonId", matchController.getBySeason);
router.get("/:id", matchController.getById);

// Rotas protegidas (precisa estar logado E ser admin)
router.post("/", authenticate, isAdmin, matchController.create);
router.put("/:id", authenticate, isAdmin, matchController.update);
router.delete("/:id", authenticate, isAdmin, matchController.delete);

module.exports = router;
