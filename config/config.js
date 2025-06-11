module.exports = { 
  "development": {
    "database": "twd",
    "dialect": "sqlite",
    "storage": "./twd.sqlite"
  },
  "test": {
    "database": "twd_test",
    "dialect": "sqlite"
  },
  "production": {
    "database": "twd_production",
    "dialect": "sqlite"
  }
}