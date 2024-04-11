const Token = require('../../../lib/service/src/model/token/token');
const ConfigService = require('../../../lib/shared/src/config/config.service');
const CommonService = require('../../../lib/shared/src/sequelize/common.service');
const jwt = require('jsonwebtoken');

class TokenService extends CommonService {
    constructor() {
        super({ model: Token });
        this.configService = ConfigService;
    }

    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload,
            this.configService.get('crypto.jwt.secret'),
            {
                expiresIn: this.configService.get('crypto.jwt.extraOptions.shortExpiresIn')
            }
        );
        
        const refreshToken = jwt.sign(
            payload,
            this.configService.get('crypto.jwt.secret'),
            {
                expiresIn: this.configService.get('crypto.jwt.extraOptions.longExpiresIn')
            }
        );
        return {
            accessToken,
            refreshToken
        };
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(
                token,
                this.configService.get('crypto.jwt.secret')
            );
        } catch {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(
                token,
                this.configService.get('crypto.jwt.secret')
            );
        } catch {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await this.findOne({ userId });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
        }

        return this.create({
            userId,
            refreshToken
        });
    }

    async removeToken(refreshToken) {
        return this.remove({ refreshToken });
    }

    async findToken(refreshToken) {
        return this.findOne({ refreshToken });
    }

}

module.exports = new TokenService();