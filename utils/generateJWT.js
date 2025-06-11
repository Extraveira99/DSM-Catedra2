const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

const generateJWT = (id = '') => {
  return new Promise((resolve, reject) => {
    const payload = { id };
    jwt.sign(payload, secret, { expiresIn: '2h' }, (err, token) => {
      if (err) {
        console.error('JWT sign error:', err);
        reject('No se pudo generar el token');
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = generateJWT;
