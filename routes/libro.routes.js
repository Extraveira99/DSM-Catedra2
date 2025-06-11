const { Router } = require('express');
const router = Router();

const validateJWT = require('../middlewares/validateJWT');

const {
  create: addBook,
  list: listBooks,
  get: getBook,
  update: updateBook,
  remove: deleteBook,
  restore: restoreBook
} = require('../controllers/bookController');

router.post('/libros', validateJWT, addBook);

router.get('/libros', listBooks);

router.get('/libros/:id', getBook);

router.put('/libros/:id', validateJWT, updateBook);

router.delete('/libros/:id', validateJWT, deleteBook);

router.put('/libros/:id/restore', validateJWT, restoreBook);

module.exports = router;