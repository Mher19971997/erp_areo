const ApiError = require('./../lib/shared/src/error/ApiError');
const tokenService = require('../src/components/token/token.service');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch {
    return res.status(401).json({ message: 'Auth error' });
  }
};
