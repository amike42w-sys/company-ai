const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quotation = sequelize.define('Quotation', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  standard: {
    type: DataTypes.STRING,
    allowNull: false
  },
  standardRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
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
  tableName: 'quotations',
  timestamps: false
});

module.exports = Quotation;