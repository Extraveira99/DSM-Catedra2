require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME || 'database';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${dbName}.sqlite`,
  logging: false
});

module.exports = sequelize;
