const { Router } = require('express');
const validateJWT    = require('../middlewares/validateJWT');
const loanController = require('../controllers/loanController');

const router = Router();

router.post('/', validateJWT, loanController.create);

router.put('/:id/devolver', validateJWT, loanController.return);

router.get('/', validateJWT, loanController.list);

router.get('/usuario/:usuario_id', validateJWT, loanController.byUser);

module.exports = router;