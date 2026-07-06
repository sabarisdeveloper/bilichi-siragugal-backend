const mysql = require("mysql2/promise");
require("dotenv").config();

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
};

if (process.env.DB_SSL === "true") {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = mysql.createPool(config);

module.exports = pool;