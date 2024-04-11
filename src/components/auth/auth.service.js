const bcrypt = require('bcrypt');
const response = require('../../../lib/shared/src/http/response');
const ApiError = require('./../../../lib/shared/src/error/ApiError');
const UserService = require('./../user/user.service');
const TokenService = require('../token/token.service');
const l10n = require('../../../lib/shared/src/config/l10n-constants');
class AuthService {
  constructor() {
    this.userService = UserService;
    this.tokenService = TokenService;
  }

  register = async (req, res, next) => {
    try {
      const { value, password } = req.body;
      const candidate = await this.userService.findOne({ value });

      if (candidate) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: 'value Exist',
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }
      const hashPassword = await bcrypt.hash(password, 3);
      const user = await this.userService.create({
        value,
        password: hashPassword
      });
      const tokens = await this.tokenService.generateTokens({
        id: user.id
      });
      await this.tokenService.saveToken(user.id, tokens.refreshToken);

      return res.json({ tokens, user });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  login = async (req, res, next) => {
    try {
      const { value, password } = req.body;
      const user = await this.userService.findOne({ value });
      // if (!user) {
      //   const responseStatus = response.status.BAD_REQUEST;
      //   const data = response.dispatch({
      //     error: l10n.user_not_found,
      //     code: responseStatus
      //   });
      //   return res.status(responseStatus).json(data);
      // }
      assert.ok(false, JSON.stringify({code: 400, error: 'dfdf'}));


      const isPassEquals = await bcrypt.compare(password, user.password);
      if (!isPassEquals) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: l10n.wrong_password,
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }

      const tokens = await this.tokenService.generateTokens({
        id: user.id
      });
      await this.tokenService.saveToken(user.id, tokens.refreshToken);
      return res.json({ tokens });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  refreshTokens = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const userData = this.tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await this.tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
        throw ApiError.UnauthorizedError();
      }
      const user = await this.userService.findOne({ id: userData.id });
      const tokens = this.tokenService.generateTokens({ id: user.id });
      await this.tokenService.saveToken(user.id, tokens.refreshToken);
      return res.json({ tokens });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  userInfo = async (req, res, next) => {
    try {
      const { id } = req.user;
      const userRes = await this.userService.findOne({ id });
      return res.json({ id: userRes.id });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

module.exports = new AuthService();