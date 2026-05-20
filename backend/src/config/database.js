require("dotenv").config({
  path: require("path").resolve(__dirname, "../../../.env"),
});

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool
  .query("SELECT 1")
  .then(() => console.log("🟢 DB conectado"))
  .catch((err) => console.error("🔴 Erro no DB:", err.message));

module.exports = pool;
