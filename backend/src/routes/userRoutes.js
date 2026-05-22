const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");

// Rota pública (criar usuário - não precisa de token)
router.post("/users", (req, res) => UserController.create(req, res));

// Rotas protegidas (precisam de token)
router.get("/users", authenticate, (req, res) =>
  UserController.getAll(req, res),
);
router.get("/users/:id", authenticate, (req, res) =>
  UserController.getById(req, res),
);
router.put("/users/:id", authenticate, (req, res) =>
  UserController.update(req, res),
);
router.delete("/users/:id", authenticate, (req, res) =>
  UserController.delete(req, res),
);

module.exports = router;
