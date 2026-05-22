const jwt = require("jsonwebtoken");
const { error, unauthorized, forbidden } = require("../utils/response");

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return unauthorized(res, "Token não fornecido");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return unauthorized(res, "Token expirado");
    }
    return unauthorized(res, "Token inválido");
  }
}

function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return forbidden(res, "Acesso restrito a administradores");
  }
  next();
}


module.exports = { authenticate, isAdmin };
