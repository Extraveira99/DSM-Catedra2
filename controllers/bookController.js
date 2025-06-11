const { Libro } = require('../models');

module.exports = {

  async create(req, res, next) {
    try {
      const { titulo, autor, genero, fecha_publicacion } = req.body;

      if (!titulo || !autor || !genero || !fecha_publicacion) {
        return res.status(400).json({
          success: false,
          message: 'Título, autor, género y fecha de publicación son obligatorios'
        });
      }

      const libro = await Libro.create({
        titulo,
        autor,
        genero,
        fecha_publicacion,
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
      const id = req.params.id;
      const fields = req.body;

      if (Object.keys(fields).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debes enviar al menos un campo para actualizar'
        });
      }

      const [count] = await Libro.update(fields, {
        where: { id }
      });

      if (count === 0) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
      }

      const updated = await Libro.findByPk(id);

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
      const id = req.params.id;

      const [count] = await Libro.update(
        { eliminado: true },
        { where: { id } }
      );

      if (count === 0) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
      }

      const updated = await Libro.findByPk(id);

      return res.json({
        success: true,
        data: updated,
        message: 'Libro eliminado correctamente'
      });

    } catch (err) {
      console.error('REMOVE ERROR:', err);
      next(err);
    }
  },

  async restore(req, res, next) {
    try {
      const id = req.params.id;

      // Ejecutar la restauración
      const [count] = await Libro.update(
        { eliminado: false },
        { where: { id } }
      );

      if (count === 0) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
      }

      const updated = await Libro.findByPk(id);

      return res.json({
        success: true,
        data: updated,
        message: 'Libro restaurado correctamente'
      });

    } catch (err) {
      console.error('RESTORE ERROR:', err);
      next(err);
    }
  }
};