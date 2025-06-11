'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Prestamo extends Model {}

Prestamo.init({
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  libroId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_prestamo: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_devolucion: DataTypes.DATEONLY,
  estado: {
    type: DataTypes.ENUM('prestado','devuelto','con retraso'),
    defaultValue: 'prestado'
  }
}, {
  sequelize,
  modelName: 'Prestamo',
  tableName: 'Prestamos',
  timestamps: true
});

Prestamo.associate = models => {
  Prestamo.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
  Prestamo.belongsTo(models.Libro, { foreignKey: 'libroId', as: 'libro' });
};

module.exports = Prestamo;