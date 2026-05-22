// src/utils/responseFormatter.js
const success = (data, message = "Sucesso") => {
  return {
    success: true,
    data,
    message,
  };
};

const error = (message, statusCode = 400, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    errors,
  };
};

module.exports = { success, error };
