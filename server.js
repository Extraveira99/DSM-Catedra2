// server.js
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./config/database');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(this.app);

    this.paths = {
      auth:  '/api/auth',
      users: '/api/users',
      books: '/api/books',
      loans: '/api/loans'
    };

    // Conexión a la base de datos
    this.dbConnection();

    // Middlewares globales
    this.middlewares();

    // Rutas
    this.routes();
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

    this.app.use(this.paths.auth,  require('./routes/auth'));

    this.app.use(this.paths.users, require('./routes/users'));

    this.app.use(this.paths.books, require('./routes/books'));

    this.app.use(this.paths.loans, require('./routes/loans'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
