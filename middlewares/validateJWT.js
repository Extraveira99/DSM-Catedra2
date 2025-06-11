'use strict';
const { response } = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const validateJWT = async (req, res = response, next) => {

  const authHeader = req.header('Authorization') || req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: true,
      message: 'No se proporcionó token'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verificar token
    const { id } = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    // Buscar usuario en BD
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Usuario no encontrado'
      });
    }
    // Adjuntar user al request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: true,
        message: 'Token expirado'
      });
    }
    return res.status(401).json({
      success: false,
      error: true,
      message: 'Token inválido'
    });
  }
};

module.exports = validateJWT;