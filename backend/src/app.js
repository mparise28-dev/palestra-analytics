const express = require("express");
const cors = require("cors");
const testRoutes = require("./routes/testRoutes");

const app = express();

// 1º Middlewares globais (ordem importa!)
app.use(cors());
app.use(express.json());

// 2º Rotas (sem /api para teste simples)
app.use("/test", testRoutes);

module.exports = app;
