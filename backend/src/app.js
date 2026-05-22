const express = require("express");
const cors = require("cors");

const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const playerRoutes = require("./routes/playerRoutes");
const seasonRoutes = require("./routes/seasonRoutes");
const matchRoutes = require("./routes/matchRoutes"); // ← REMOVI o /src/

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS
app.use("/test", testRoutes);
app.use("/api", userRoutes);
app.use("/auth", authRoutes);
app.use("/api", playerRoutes);
app.use("/api", seasonRoutes);
app.use("/api/matches", matchRoutes);

// ERROR HANDLER
app.use(errorHandler);

module.exports = app;
