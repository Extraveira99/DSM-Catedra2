'use strict';

const { Usuario } = require('../models');
const bcrypt       = require('bcryptjs');
const jwtUtils     = require('../utils/generateJWT');

const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ success: false, error: true, message: 'Todos los campos son obligatorios' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ success: false, error: true, message: 'Correo no válido' });
    }

    if (contrasena.length < 8) {
      return res.status(400).json({ success: false, error: true, message: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(409).json({ success: false, error: true, message: 'Correo ya registrado' });
    }

    const hash = bcrypt.hashSync(contrasena, 10);
    const user = await Usuario.create({ nombre, apellido, correo, contrasena: hash });

    const token = await jwtUtils(user.id);
    return res.status(201).json({
      success: true,
      data: { id: user.id, correo: user.correo, token },
      message: 'Registro exitoso'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: true, message: 'Error interno al registrar' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ success: false, error: true, message: 'Correo y contraseña requeridos' });
    }
    const user = await Usuario.findOne({ where: { correo } });
    if (!user) {
      return res.status(401).json({ success: false, error: true, message: 'Credenciales inválidas' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, error: true, message: 'Usuario deshabilitado' });
    }
    const isValid = bcrypt.compareSync(contrasena, user.contrasena);
    if (!isValid) {
      return res.status(401).json({ success: false, error: true, message: 'Credenciales inválidas' });
    }
    const token = await jwtUtils(user.id);
    return res.json({
      success: true,
      data: { id: user.id, nombre: user.nombre, apellido: user.apellido, correo: user.correo, token },
      message: 'Inicio de sesión exitoso'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: true, message: 'Error interno al iniciar sesión' });
  }
};

const me = (req, res) => {

  const { id, nombre, apellido, correo, isActive, isVerified } = req.user;
  return res.json({ success: true, data: { id, nombre, apellido, correo, isActive, isVerified } });
};

module.exports = {
  register,
  login,
  me,
};