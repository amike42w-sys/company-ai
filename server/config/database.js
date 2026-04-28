const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('certificate_db', 'certificate_db', '050309', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log, // 【必须开启】我们要看 SQL 日志
  // --- 核心修改：加上下面这两行 ---
  timezone: '+08:00', // 强制 Sequelize 使用东八区时间
  dialectOptions: {
    dateStrings: true, // 强制以字符串格式从数据库读取日期，防止时区二次转换
    typeCast: true
  }
});

// 还要加上这一行，因为 index.js 需要它
const certificatesUploadPath = path.join(__dirname, '../../uploads/certificates');

module.exports = { sequelize, certificatesUploadPath };
