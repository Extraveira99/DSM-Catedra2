const { Router } = require('express');
const validateJWT = require('../middlewares/validateJWT');
const {
  create: createLoan,
  return: returnLoan,
  list: listLoans,
  byUser: loansByUser
} = require('../controllers/loanController');

const router = Router();

router.post('/loan', validateJWT, createLoan);

router.put('/loan/return/:id', validateJWT, returnLoan);

router.get('/loans', validateJWT, listLoans);

router.get('/loans/users/:usuario_id', validateJWT, loansByUser);

module.exports = router;