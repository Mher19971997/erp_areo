const express = require('express');
const fileCtr = require('./file.service');
const authMiddleware = require('../../../middleware/auth.middleware');

const fileRouter = express.Router();
const Upload = require('../../../lib/shared/src/uploadFile');
const filterFileByIdSchema = require('./dto/input/filter_file_by_id.input.json');
const createFileSchema = require('./dto/input/create_file.input.json');
const { validateSchema, ajv } = require('../../../lib/shared/src/validation/validation');

ajv.addSchema(filterFileByIdSchema, 'filter_file_by_id');
ajv.addSchema(createFileSchema, 'createFile');

const upload = new Upload('public/files');

fileRouter.get('/list', authMiddleware, fileCtr.getFiles);
fileRouter.get('/:id', validateSchema('filter_file_by_id', 'params'), authMiddleware, fileCtr.getFileById);
fileRouter.get('/download/:id', authMiddleware, validateSchema('filter_file_by_id', 'params'), fileCtr.downloadFileById);
fileRouter.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  validateSchema('createFile', 'file'), 
  fileCtr.uploadFile
);
fileRouter.put(
  '/update/:id',
  authMiddleware,
  upload.single('file'),
  validateSchema('filter_file_by_id', 'params'),
  fileCtr.updateFileById
);
fileRouter.delete('/delete/:id', authMiddleware, validateSchema('filter_file_by_id', 'params'), fileCtr.deleteFileById);

module.exports = fileRouter;
