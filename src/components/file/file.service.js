const fs = require('fs');
const File = require('../../../lib/service/src/model/file/file');
const response = require('../../../lib/shared/src/http/response');
const util = require('../../../lib/shared/src/util/util');
const CommonService = require('../../../lib/shared/src/sequelize/common.service');

class FileService extends CommonService {
  constructor() {
    super({ model: File });
  }

  uploadFile = async (req, res, next) => {
    try {
      const { mimetype, filename, size } = req.file;
      const { id } = req.user;
      const file = await this.create({
        userId: id,
        name: req.file.filename,
        extension: util.getExtension(filename),
        mimetype: mimetype,
        size: size
      });
      return res.json(file);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  updateFileById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const file = await this.findOne({ id, userId });

      if (!file) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: 'File not found',
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }

      if (req.file) {
        const filePath = `${process.cwd()}/public/files/${file.name}`;
        await fs.unlink(filePath, async (err) => {
          if (err) {
            const responseStatus = response.status.BAD_REQUEST;
            const data = response.dispatch({
              error: 'Wrong',
              code: responseStatus
            });
            return res.status(responseStatus).json(data);
          }
        });
      }
      const { mimetype, filename, size } = req.file;

      const fileUp = await this.update(
        {
          id, userId
        },
        {
          mimetype,
          name: req.file.filename,
          size,
          extension: util.getExtension(filename)
        }
      );
      return res.json(fileUp);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  deleteFileById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;

      const file = await this.findOne({ id, userId });
      if (!file) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: 'File not found',
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }
      const filePath = `${process.cwd()}/public/files/${file.name}`;
      await this.remove({ id });
      await fs.unlink(filePath, async (err) => {
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
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  downloadFileById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;

      const file = await this.findOne({ id, userId });
      if (!file) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: 'File not found',
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }
      await this.update(
        {
          id
        },
        { dataDownload: new Date() }
      );
      const filePath = `${process.cwd()}/public/files/${file.name}`;
      return res.download(filePath, file.name);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  getFileById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const file = await this.findOne({ id, userId });
      return res.json(file);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  getFiles = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { list_size = 10, page = 1 } = req.query

      const files = await this.findAll({
        userId,
        queryMeta: {
          paginate: true,
          limit: list_size,
          page: page
        }
      });
      return res.json(files);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

module.exports = new FileService();