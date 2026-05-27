const express = require("express");
const cors = require("cors");
const path = require("path");

const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const playerRoutes = require("./routes/playerRoutes");
const seasonRoutes = require("./routes/seasonRoutes");
const matchRoutes = require("./routes/matchRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS DA API
app.use("/test", testRoutes);
app.use("/api", userRoutes);
app.use("/auth", authRoutes);
app.use("/api", playerRoutes);
app.use("/api", seasonRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/statistics", statisticsRoutes);

// 👇 SERVE O FRONTEND (arquivos estáticos)
const frontendPath = path.join(__dirname, "../../frontend");
app.use(express.static(frontendPath));

// 👇 FALLBACK - QUALQUER ROTA NÃO ENCONTRADA VAI PARA O INDEX.HTML
// NÃO use app.get() - use app.use() com um middleware simples
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ERROR HANDLER (deve ser o último)
app.use(errorHandler);

module.exports = app;
