const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

const verifyToken = require('../middlewares/validateJWT');
router.get('/me', verifyToken, authController.me);

module.exports = router;
