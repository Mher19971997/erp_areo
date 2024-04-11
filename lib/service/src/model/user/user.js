const { DataTypes } = require('sequelize');
const sequelize = require('../../db_connect');

const User = sequelize.define(
  'users',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.STRING, require: true, unique: true },
    password: { type: DataTypes.STRING, require: true }
  },
  {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

module.exports = User;
