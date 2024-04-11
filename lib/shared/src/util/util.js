const Path = require('path');
const response = require('../http/response');
const fs = require('fs');
class Util {
  getExtension = (filename) => {
    const ext = Path.extname(filename || '').split('.');
    return ext[ext.length - 1];
  };
  unlinkFile = (res, filePath) => {
    fs.unlink(filePath, async (err) => {
      if (err) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: 'Wrong',
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      } else {
        const responseStatus = response.status.OK;
        const data = response.dispatch({
          error: 'Successfully deleted the file.',
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }
    });
  };
}

module.exports = new Util();
