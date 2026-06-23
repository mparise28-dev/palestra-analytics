const jwt = require("jsonwebtoken");
const UserService = require("../services/userService");
const { success, error } = require("../utils/response");

class AuthController {
  // Registro
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const user = await UserService.createUser({ name, email, password });

      // Gera token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      return success(res, { user, token }, "Usuário criado com sucesso", 201);
    } catch (err) {
      return error(res, err.message, 400);
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserService.login(email, password);

      // Gera token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      return success(res, { user, token }, "Login realizado com sucesso");
    } catch (err) {
      return error(res, err.message, 401);
    }
  }
}

module.exports = new AuthController();
