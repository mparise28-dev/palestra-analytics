const express = require("require");
const cors = require("cors");
const testRoutes = require("./routes/testRoutes");

const app = express();

app.use("/api", testRoutes);
app.use(cors());
app.use(express.json());

module.exports = app;
