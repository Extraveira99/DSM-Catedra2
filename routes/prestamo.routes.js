const { Router } = require('express');
const router = Router();

const validateJWT = require('../middlewares/validateJWT');

const {
  create: createLoan,
  return: returnLoan,
  list: listLoans,
  byUser: loansByUser
} = require('../controllers/loanController');

router.post('/prestamos', validateJWT, createLoan);

router.put('/prestamos/:id/devolver', validateJWT, returnLoan);

router.get('/prestamos', validateJWT, listLoans);

router.get('/prestamos/usuario/:usuario_id', validateJWT, loansByUser);

module.exports = router;