const bcrypt = require("bcrypt");
const UserRepository = require("../repository/userRepository");

class UserService {
  // CREATE com hash de senha
  async createUser(data) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new Error("Campos obrigatórios faltando");
    }

    if (!email.includes("@")) {
      throw new Error("Email inválido");
    }

    if (password.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }

    // Verifica se email já existe
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email já cadastrado");
    }

    // Hash da senha (crucial!)
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await UserRepository.create({
      name,
      email,
      password_hash,
    });

    return user;
  }

  // Login
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    // Busca usuário com a senha hash
    const user = await UserRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    // Compara a senha com o hash
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new Error("Email ou senha inválidos");
    }

    // Remove o hash antes de retornar
    delete user.password_hash;

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
