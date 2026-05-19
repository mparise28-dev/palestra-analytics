const express = require("express");
const cors = require("cors");
const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// 1º Middlewares globais (ordem importa!)
app.use(cors());
app.use(express.json());

// 2º Rotas (sem /api para teste simples)
app.use("/test", testRoutes);
app.use("/api", userRoutes);

module.exports = app;
