const path = require("path");
const fs = require("fs");
const app = require("./app");

const envPath = path.resolve(__dirname, "../../../.env");

console.log("ENV PATH:", envPath);
console.log("EXISTS:", fs.existsSync(envPath));

require("dotenv").config({ path: envPath });

console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

// 🔥 AQUI ESTÁ O QUE ESTAVA FALTANDO
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
  