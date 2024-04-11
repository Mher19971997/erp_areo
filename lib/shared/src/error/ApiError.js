const response = require('../http/response');

class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static unauthorizedError() {
    const responseStatus = response.status.UNAUTHORIZED;
    const data = response.dispatch({
      error: 'Пользователь не авторизован',
      code: responseStatus
    });
    return { status: responseStatus, data };
  }

  static badRequest(message, errors = []) {
    const responseStatus = response.status.BAD_REQUEST;
    const data = response.dispatch({
      message,
      errors,
      code: responseStatus
    });
    return { status: responseStatus, data };
  }
}

module.exports = ApiError;
