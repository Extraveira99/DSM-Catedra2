'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Usuario extends Model {}

Usuario.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'Usuarios',
  timestamps: true
});

Usuario.associate = models => {
  Usuario.hasMany(models.Prestamo, { foreignKey: 'usuarioId', as: 'prestamos' });
};

module.exports = Usuario;