const { Libro } = require('../models');

module.exports = {
  async create(req, res, next) {
    try {
      const libro = await Libro.create({ ...req.body, disponible:true, eliminado:false });
      res.status(201).json(libro);
    } catch(err){ next(err); }
  },
  async list(req, res, next) {
    try {
      const libros = await Libro.findAll();
      res.json(libros);
    } catch(err){ next(err); }
  },
  async get(req, res, next) {
    try {
      const libro = await Libro.findByPk(req.params.id);
      if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
      res.json(libro);
    } catch(err){ next(err); }
  },
  async update(req, res, next) {
    try {
      const [_, [updated]] = await Libro.update(req.body, { where:{id:req.params.id}, returning:true });
      if (!updated) return res.status(404).json({ error: 'Libro no encontrado' });
      res.json(updated);
    } catch(err){ next(err); }
  },
  async remove(req, res, next) {
    try {
      const [_, [updated]] = await Libro.update({ eliminado:true }, { where:{id:req.params.id}, returning:true });
      if (!updated) return res.status(404).json({ error: 'Libro no encontrado' });
      res.json(updated);
    } catch(err){ next(err); }
  },
  async restore(req, res, next) {
    try {
      const [_, [updated]] = await Libro.update({ eliminado:false }, { where:{id:req.params.id}, returning:true });
      if (!updated) return res.status(404).json({ error: 'Libro no encontrado' });
      res.json(updated);
    } catch(err){ next(err); }
  }
};