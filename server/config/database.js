const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('certificate_db', 'certificate_db', '050309', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: console.log, // 【必须开启】我们要看 SQL 日志
});

// 还要加上这一行，因为 index.js 需要它
const certificatesUploadPath = path.join(__dirname, '../../uploads/certificates');

module.exports = { sequelize, certificatesUploadPath };
