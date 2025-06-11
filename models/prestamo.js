'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Prestamo extends Model {
    static associate(models) {
      Prestamo.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario'
      });

      Prestamo.belongsTo(models.Libro, {
        foreignKey: 'libroId',
        as: 'libro'
      });
    }
  }

  Prestamo.init({
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'usuarioId debe ser un número entero' },
        notNull: { msg: 'usuarioId es obligatorio' }
      }
    },
    libroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'libroId debe ser un número entero' },
        notNull: { msg: 'libroId es obligatorio' }
      }
    },
    fecha_prestamo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'fecha_prestamo debe ser una fecha válida' },
        notNull: { msg: 'fecha_prestamo es obligatoria' }
      }
    },
    fecha_devolucion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: { msg: 'fecha_devolucion debe ser una fecha válida' }
      }
    },
    estado: {
      type: DataTypes.ENUM('prestado', 'devuelto', 'con retraso'),
      defaultValue: 'prestado',
      validate: {
        isIn: {
          args: [['prestado', 'devuelto', 'con retraso']],
          msg: 'Estado no válido'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Prestamo',
    tableName: 'Prestamos',
    timestamps: true
  });

  return Prestamo;
};
