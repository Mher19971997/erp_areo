const jwt = require('jsonwebtoken');
const ConfigService = require('./../config/config.service');

class JWTService {
  constructor() {
    this.configService = ConfigService;
  }

  generateToken = (payload) => {
    return jwt.sign(payload, this.configService.get('crypto.jwt.secret'), {
      expiresIn: '24h'
    });
  };

  jwtVerify(token) {
    return jwt.verify(token, this.configService.get('crypto.jwt.secret'));
  }
}

module.exports = new JWTService();