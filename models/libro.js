const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Libro extends Model {}

Libro.init({
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genero: DataTypes.STRING,
  fecha_publicacion: DataTypes.DATEONLY,
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  eliminado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Libro',
  tableName: 'Libros',
  timestamps: true
});

Libro.associate = models => {
  Libro.hasMany(models.Prestamo, { foreignKey: 'libroId', as: 'prestamos' });
};

module.exports = Libro;