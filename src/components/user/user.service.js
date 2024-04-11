const User = require("../../../lib/service/src/model/user/user");
const CommonService = require('../../../lib/shared/src/sequelize/common.service');

class UserService extends CommonService {
  constructor() {
    super({ model: User });
  }
}

module.exports = new UserService();
