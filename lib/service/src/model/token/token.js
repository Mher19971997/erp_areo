const { DataTypes } = require('sequelize');
const sequelize = require('../../db_connect');

const Token = sequelize.define(
  'tokens',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, require: true },
  },
  {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

module.exports = Token;
