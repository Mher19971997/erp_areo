const { Sequelize } = require('sequelize');
const winston = require('winston');
const configService = require('./../../shared/src/config/config.service');

const { database, user, password, host, port } = configService.get('db.mysql');

module.exports = new Sequelize(database, user, password, {
  dialect: 'mysql',
  host: host,
  port: port,
  logging: winston.debug
});
