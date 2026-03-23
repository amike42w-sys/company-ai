const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '客户等级 S/A/B/C'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '客户名称'
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '地区'
  },
  buildingType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '建筑类型'
  },
  productType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '产品种类'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '进度/状态'
  },
  manager: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '负责人'
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '时间'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'customers',
  timestamps: false
});

module.exports = Customer;