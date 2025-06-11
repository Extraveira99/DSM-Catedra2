const { Router } = require('express');
const validateJWT = require('../middlewares/validateJWT');
const {
  create: addBook,
  list: listBooks,
  get: getBook,
  update: updateBook,
  remove: deleteBook,
  restore: restoreBook
} = require('../controllers/bookController');

const router = Router();

router.post('/add/book', validateJWT, addBook);

router.get('/books', listBooks);

router.get('/book/:id', getBook);

router.put('/book/:id', validateJWT, updateBook);

router.delete('/book/:id', validateJWT, deleteBook);

module.exports = router;