const UserService = require("../services/userService");

// Controller = camada que lida com HTTP (req/res)
class UserController {
  // CREATE - criar usuário
  async create(req, res) {
    try {
      // pega dados enviados no body da requisição
      const { name, email, password } = req.body;

      // chama o service (regra de negócio)
      const user = await UserService.createUser({
        name,
        email,
        password,
      });

      // retorna resposta HTTP de sucesso
      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      // se der erro, responde para o cliente
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // READ - listar todos usuários
  async getAll(req, res) {
    try {
      // chama service para buscar dados
      const users = await UserService.getAllUsers();

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // READ - buscar usuário por ID
  async getById(req, res) {
    try {
      // pega id da URL (/users/:id)
      const { id } = req.params;

      // converte pra número (boa prática)
      const user = await UserService.getUserById(Number(id));

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // UPDATE - atualizar usuário
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const user = await UserService.updateUser(Number(id), {
        name,
        email,
      });

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE - remover usuário
  async delete(req, res) {
    try {
      const { id } = req.params;

      await UserService.deleteUser(Number(id));

      return res.status(200).json({
        success: true,
        message: "Usuário deletado com sucesso",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

// exporta instância do controller
module.exports = new UserController();
