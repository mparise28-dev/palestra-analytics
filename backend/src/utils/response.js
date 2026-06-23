function success(res, data = {}, message = "OK", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

function error(res, message = "Erro", statusCode = 400, data = null) {
  return res.status(statusCode).json({
    success: false,
    data,
    message,
  });
}

function unauthorized(res, message = "Não autorizado") {
  return error(res, message, 401);
}

function forbidden(res, message = "Acesso negado") {
  return error(res, message, 403);
}

// Criando os apelidos
const successResponse = success;
const errorResponse = error;

module.exports = {
  success,
  error,
  unauthorized,
  forbidden,
  successResponse,
  errorResponse,
};
