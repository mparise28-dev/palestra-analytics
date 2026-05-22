const UserService = require("../services/userService");
const { success, error } = require("../utils/response");

class UserController {
  async create(req, res) {
  try {
    const { name, email, password } = req.body;

    // ✅ VALIDAÇÃO REMOVIDA (foi pro service)
    const user = await UserService.createUser({
      name,
      email,
      password,
    });

    return success(res, user, "Usuário criado com sucesso", 201);
  } catch (err) {
    return error(res, err.message || "Erro ao criar usuário", 400);
  }
}

  async getAll(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return success(res, users, "Usuários listados com sucesso");
    } catch (err) {
      return error(res, "Erro ao buscar usuários", 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(Number(id));

      if (!user) {
        return error(res, "Usuário não encontrado", 404);
      }

      return success(res, user, "Usuário encontrado");
    } catch (err) {
      return error(res, "Erro ao buscar usuário", 500);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!name && !email) {
        return error(res, "Nada para atualizar", 400);
      }

      const user = await UserService.updateUser(Number(id), {
        name,
        email,
      });

      return success(res, user, "Usuário atualizado com sucesso");
    } catch (err) {
      return error(res, err.message || "Erro ao atualizar usuário", 400);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(Number(id));
      return success(res, null, "Usuário deletado com sucesso");
    } catch (err) {
      return error(res, "Erro ao deletar usuário", 400);
    }
  }
}

module.exports = new UserController();
