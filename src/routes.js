const authRouter = require('./components/auth/auth.controller');
const fileRouter = require('./components/file/file.controller');

module.exports = (app) => {
  app.use('/', authRouter);
  app.use('/file', fileRouter);
};
