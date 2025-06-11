require('dotenv').config();
const { Sequelize } = require('sequelize');

const db = new Sequelize({
  dialect:  'sqlite',
  logging:  false,
  storage:  `${process.env.DB_NAME || 'database'}.sqlite`
});

module.exports = db;