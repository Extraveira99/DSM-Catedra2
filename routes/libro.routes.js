const { Router } = require('express');
const validateJWT    = require('../middlewares/validateJWT');
const bookController = require('../controllers/bookController');

const router = Router();

router.post('/', validateJWT, bookController.create);

router.get('/', bookController.list);

router.get('/:id', bookController.get);

router.put('/:id', validateJWT, bookController.update);

router.delete('/:id', validateJWT, bookController.remove);

router.put('/:id/restore', validateJWT, bookController.restore);

module.exports = router;