const { Router } = require('express');
const validateJWT = require('../middlewares/validateJWT');
const { register, login, me } = require('../controllers/authController');

const router = Router();

router.post('/register', register); // POST /api/auth/register
router.post('/login', login);       // POST /api/auth/login
router.get('/me', validateJWT, me); // GET /api/auth/me

module.exports = router;
