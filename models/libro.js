'use strict';
module.exports = (sequelize, DataTypes) => {
  const Libro = sequelize.define('Libro', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    autor: { type: DataTypes.STRING, allowNull: false },
    genero: { type: DataTypes.STRING },
    fecha_publicacion: { type: DataTypes.DATEONLY },
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
    eliminado: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'Libros',
    timestamps: true
  });

  Libro.associate = models => {
    Libro.hasMany(models.Prestamo, { foreignKey: 'libroId', as: 'prestamos' });
  };

  return Libro;
};