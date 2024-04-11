const User = require('./user/user');
const File = require('./file/file');
const Token = require('./token/token');

User.hasOne(File); // mek@ meki
User.hasOne(Token); // mek@ meki
Token.hasMany(Token); // mek@ meki

User.hasMany(File); // kara mi qani hat rating unena
File.belongsTo(User);

const models = [User, File, Token];

module.exports = models;
