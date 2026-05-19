const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");

// CREATE - criar usuário
router.post("/users", (req, res) => UserController.create(req, res));

// READ - listar todos usuários
router.get("/users", (req, res) => UserController.getAll(req, res));

// READ - buscar usuário por ID
router.get("/users/:id", (req, res) => UserController.getById(req, res));

// UPDATE - atualizar usuário
router.put("/users/:id", (req, res) => UserController.update(req, res));

// DELETE - remover usuário
router.delete("/users/:id", (req, res) => UserController.delete(req, res));

module.exports = router;
