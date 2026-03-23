const { sequelize } = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const Certificate = require('./Certificate');
const Quotation = require('./Quotation');
const Message = require('./Message');
const Session = require('./Session');
const Customer = require('./Customer');

// 定义关联关系
User.belongsTo(Company, { foreignKey: 'companyId' });
Company.hasMany(User, { foreignKey: 'companyId' });
Company.hasMany(Certificate, { foreignKey: 'companyId' });
Certificate.belongsTo(Company, { foreignKey: 'companyId' });

// 同步数据库
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('数据库同步成功');
  } catch (error) {
    console.error('数据库同步失败:', error);
    console.log('服务器将继续运行，但数据库功能将不可用');
  }
};

module.exports = {
  sequelize,
  User,
  Company,
  Certificate,
  Quotation,
  Message,
  Session,
  Customer,
  syncDatabase
};