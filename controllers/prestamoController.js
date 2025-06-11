const { Prestamo, Libro, Usuario } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  async create(req, res, next) {
    try {
      const today = new Date();
      const due = new Date(); due.setDate(today.getDate()+7);
      const loan = await Prestamo.create({
        usuarioId: req.user.id,
        libroId: req.body.libroId,
        fecha_prestamo: today,
        fecha_devolucion: due,
        estado: 'prestado'
      });
      res.status(201).json(loan);
    } catch(err){ next(err); }
  },
  async return(req, res, next) {
    try {
      const prestamo = await Prestamo.findByPk(req.params.id);
      if (!prestamo) return res.status(404).json({ error:'Préstamo no encontrado' });
      const now = new Date();
      const estado = now > new Date(prestamo.fecha_devolucion) ? 'con retraso' : 'devuelto';
      prestamo.estado = estado;
      await prestamo.save();
      res.json(prestamo);
    } catch(err){ next(err); }
  },
  async list(req, res, next) {
    try {
      const loans = await Prestamo.findAll({ include:['usuario','libro'] });
      res.json(loans);
    } catch(err){ next(err); }
  },
  async byUser(req, res, next) {
    try {
      const loans = await Prestamo.findAll({ where:{ usuarioId: req.params.usuario_id }, include:['libro'] });
      res.json(loans);
    } catch(err){ next(err); }
  }
};