const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  companyId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // 【新增】这一行必须有，否则你没法删除物理文件！
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageBase64: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  originalName: { // 顺便把你之前代码里用到的 originalName 也加上
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: 'certificates',
  timestamps: false
});

module.exports = Certificate;