const express = require("express");
const cors = require("cors");

const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS
app.use("/test", testRoutes);
app.use("/api", userRoutes);

// ERROR HANDLER SEMPRE POR ÚLTIMO
app.use(errorHandler);

module.exports = app;
