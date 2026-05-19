const UserRepository = require("../repository/userRepository");

class UserService {
  async createUser(data) {
    // aqui poderia ter validação, regras, etc
    if (!data.name || !data.email || !data.password) {
      throw new Error("Campos obrigatórios faltando");
    }

    const user = await UserRepository.create(data);
    return user;
  }

  async getAllUsers() {
    return await UserRepository.findAll();
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }

  async updateUser(id, data) {
    const user = await UserRepository.update(id, data);

    if (!user) {
      throw new Error("Usuário não encontrado para atualizar");
    }

    return user;
  }

  async deleteUser(id) {
    return await UserRepository.delete(id);
  }
}

module.exports = new UserService();
