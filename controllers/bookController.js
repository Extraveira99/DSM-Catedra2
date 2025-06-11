const { Libro } = require('../models');

module.exports = {
  async create(req, res, next) {
    try {
      const { titulo, autor } = req.body;

      if (!titulo || !autor) {
        return res.status(400).json({
          success: false,
          message: 'Título y autor son obligatorios'
        });
      }

      const libro = await Libro.create({
        ...req.body,
        disponible: true,
        eliminado: false
      });

      return res.status(201).json({
        success: true,
        data: libro,
        message: 'Libro creado exitosamente'
      });

    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const libros = await Libro.findAll();
      return res.json({ success: true, data: libros });
    } catch (err) {
      next(err);
    }
  },

  async get(req, res, next) {
    try {
      const libro = await Libro.findByPk(req.params.id);
      if (!libro) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
      }

      return res.json({ success: true, data: libro });

    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const [_, [updated]] = await Libro.update(req.body, {
        where: { id: req.params.id },
        returning: true
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
      }

      return res.json({
        success: true,
        data: updated,
        message: 'Libro actualizado exitosamente'
      });

    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const [_, [updated]] = await Libro.update({ eliminado: true }, {
        where: { id: req.params.id },
        returning: true
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
      }

      return res.json({
        success: true,
        data: updated,
        message: 'Libro eliminado (soft delete)'
      });

    } catch (err) {
      next(err);
    }
  },

  async restore(req, res, next) {
    try {
      const [_, [updated]] = await Libro.update({ eliminado: false }, {
        where: { id: req.params.id },
        returning: true
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
      }

      return res.json({
        success: true,
        data: updated,
        message: 'Libro restaurado correctamente'
      });

    } catch (err) {
      next(err);
    }
  }
};
