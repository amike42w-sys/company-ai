const { Sequelize } = require('sequelize');

// 创建数据库连接
const sequelize = new Sequelize('certificate_db', 'root', '050309', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

module.exports = sequelize;