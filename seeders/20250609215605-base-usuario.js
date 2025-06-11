'use strict';
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Usuarios', [
      {
        nombre:     'Jose',
        apellido:   'Benitez',
        correo:     'jose.benitez@ce.ucn.cl',
        contrasena: bcrypt.hashSync('jbenitez123', salt),
        isActive:   true,
        createdAt:  new Date(),
        updatedAt:  new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', {
      correo: 'jose.benitez@ce.ucn.cl'
    }, {});
  }
};
