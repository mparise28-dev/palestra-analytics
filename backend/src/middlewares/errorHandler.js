function errorHandler(err, req, res, next) {
  console.error(err.message);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    data: null,
    message: err.message || "Erro interno do servidor",
  });
}

module.exports = errorHandler;
