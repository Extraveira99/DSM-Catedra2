'use strict';
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./config/database');
require('dotenv').config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(this.app);

    this.paths = {
      auth:  '/api/auth',
      books: '/api/libros',
      loans: '/api/prestamos'
    };

    this.dbConnection();
    this.middlewares();
    this.routes();
    this.notFoundHandler();
    this.errorHandler();
  }

  async dbConnection() {
    try {
      await db.authenticate();
      await db.sync();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Error connecting to database:', error);
    }
  }

  middlewares() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(cors());
  }

  routes() {
    this.app.use(this.paths.auth,  require('./routes/auth.routes'));
    this.app.use(this.paths.books, require('./routes/libro.routes'));
    this.app.use(this.paths.loans, require('./routes/prestamo.routes'));
  }

  notFoundHandler() {
    this.app.use((req, res) => {
      res.status(404).json({ success: false, error: true, message: 'Endpoint no encontrado' });
    });
  }

  errorHandler() {
    this.app.use((err, req, res, next) => {
      console.error('Error interno:', err);
      res.status(500).json({ success: false, error: true, message: err.message || 'Error interno del servidor' });
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
    });
  }
}

if (require.main === module) {
  new Server().listen();
}

module.exports = Server;