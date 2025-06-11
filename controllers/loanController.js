const { Prestamo, Libro, Usuario } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  
  async create(req, res, next) {
    try {
      const { libroId } = req.body;
      const usuarioId = req.user.id;

      if (!libroId) {
        return res.status(400).json({ success: false, message: 'ID del libro es requerido' });
      }

      const libro = await Libro.findByPk(libroId);
      if (!libro || !libro.disponible) {
        return res.status(404).json({ success: false, message: 'Libro no disponible o no encontrado' });
      }

      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 7);

      const loan = await Prestamo.create({
        usuarioId,
        libroId,
        fecha_prestamo: today,
        fecha_devolucion: dueDate,
        estado: 'prestado'
      });

      libro.disponible = false;
      await libro.save();

      return res.status(201).json({ success: true, data: loan, message: 'Préstamo registrado' });

    } catch (err) {
      next(err);
    }
  },

  async return(req, res, next) {
    try {
      const { id } = req.params;
      const prestamo = await Prestamo.findByPk(id);

      if (!prestamo) {
        return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
      }

      const now = new Date();
      const estado = now > new Date(prestamo.fecha_devolucion) ? 'con retraso' : 'devuelto';

      prestamo.estado = estado;
      await prestamo.save();

      const libro = await Libro.findByPk(prestamo.libroId);
      if (libro) {
        libro.disponible = true;
        await libro.save();
      }

      return res.json({ success: true, data: prestamo, message: 'Libro devuelto' });

    } catch (err) {
      next(err);
    }
  },

async list(req, res, next) {
  try {
    const loans = await Prestamo.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'correo']
        },
        {
          model: Libro,
          as: 'libro',
          attributes: ['id', 'titulo', 'autor']
        }
      ]
    });

    const result = loans.map(loan => ({
      id: loan.id,
      fecha_prestamo: loan.fecha_prestamo,
      fecha_devolucion: loan.fecha_devolucion,
      estado: loan.estado,
      usuario: loan.usuario,
      libro:   loan.libro
    }));

    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
},

async byUser(req, res, next) {
  try {
    const { usuario_id } = req.params;

    const user = await Usuario.findByPk(usuario_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const loans = await Prestamo.findAll({
      where: { usuarioId: usuario_id },
      include: [{
        model: Libro,
        as: 'libro',
        attributes: ['id', 'titulo', 'autor', 'genero', 'fecha_publicacion']
      }]
    });

    const libros = loans.map(loan => loan.libro);

    return res.json({ success: true, data: libros });

  } catch (err) {
    next(err);
  }},
};