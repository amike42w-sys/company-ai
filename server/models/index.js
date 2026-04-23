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
const syncDatabase = () => {
  sequelize.sync()
    .then(() => console.log('数据库同步成功'))
    .catch(err => console.error('同步失败，但不影响运行:', err.message));
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