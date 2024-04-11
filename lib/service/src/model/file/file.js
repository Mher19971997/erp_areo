const { DataTypes } = require('sequelize');
const sequelize = require('../../db_connect');

const File = sequelize.define(
  'files',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, require: true },
    extension: { type: DataTypes.STRING, require: true },
    mimetype: { type: DataTypes.STRING, require: true },
    size: { type: DataTypes.STRING, require: true },
    dataDownload: { type: DataTypes.DATE }
  },
  {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

module.exports = File;
