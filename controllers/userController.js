const Usuario = require('../models/');

module.exports = {
  async list(req, res, next) {
    try {
      const usuarios = await Usuario.findAll({ attributes: ['id','nombre','apellido','correo','isActive'] });
      res.json(usuarios);
    } catch (err) { next(err); }
  },
  async get(req, res, next) {
    try {
      const user = await Usuario.findByPk(req.params.id, { attributes: ['id','nombre','apellido','correo','isActive'] });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    } catch (err) { next(err); }
  },
  async update(req, res, next) {
    try {
      const [_, [updated]] = await Usuario.update(req.body, { where:{id:req.params.id}, returning:true });
      if (!updated) return res.status(404).json({ error: 'Usuario no encontrado y no actualizado' });
      res.json({ id: updated.id, nombre: updated.nombre, apellido: updated.apellido, correo: updated.correo, isActive: updated.isActive });
    } catch(err){ next(err); }
  },
  async remove(req, res, next) {
    try {
      const deleted = await Usuario.destroy({ where:{id:req.params.id} });
      if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.status(204).end();
    } catch(err){ next(err); }
  }
};