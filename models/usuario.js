'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Prestamo, {
        foreignKey: 'usuarioId',
        as: 'prestamos'
      });
    }
  }

  Usuario.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacío' },
        len: { args: [2, 50], msg: 'El nombre debe tener entre 2 y 50 caracteres' }
      }
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El apellido no puede estar vacío' },
        len: { args: [2, 50], msg: 'El apellido debe tener entre 2 y 50 caracteres' }
      }
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Debe ser un correo válido' },
        notNull: { msg: 'El correo es obligatorio' }
      }
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La contraseña no puede estar vacía' },
        len: { args: [6, 100], msg: 'La contraseña debe tener al menos 6 caracteres' }
      }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuarios',
    timestamps: true
  });

  return Usuario;
};
