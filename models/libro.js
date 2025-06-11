'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Libro extends Model {
    static associate(models) {

      Libro.hasMany(models.Prestamo, {
        foreignKey: 'libroId',
        as: 'prestamos'
      });
    }
  }

  Libro.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título no puede estar vacío' }
      }
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El autor no puede estar vacío' }
      }
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_publicacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
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

  return Libro;
};
