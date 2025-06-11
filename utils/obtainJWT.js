const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

const obtainIdJWT = (token) => {
  const { id } = jwt.verify(token, secret);
  return id;
};

module.exports = obtainIdJWT;