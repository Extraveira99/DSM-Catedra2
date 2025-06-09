'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prestamo = sequelize.define('Prestamo', {
    fecha_prestamo: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_devolucion: { type: DataTypes.DATEONLY },
    estado: {
      type: DataTypes.ENUM('prestado','devuelto','con retraso'),
      defaultValue: 'prestado'
    }
  }, {
    tableName: 'Prestamos',
    timestamps: true
  });

  Prestamo.associate = models => {
    Prestamo.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    Prestamo.belongsTo(models.Libro,   { foreignKey: 'libroId',   as: 'libro' });
  };

  return Prestamo;
};