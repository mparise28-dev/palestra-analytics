const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "Token não fornecido",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "Token inválido",
    });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      data: null,
      message: "Acesso restrito a administradores",
    });
  }
  next();
}

module.exports = { authenticate, isAdmin };