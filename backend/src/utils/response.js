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

module.exports = { success, error };
