const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'root', // Replace with your MySQL password
  database: 'railway_system',
});

module.exports = db;
