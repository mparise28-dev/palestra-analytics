const path = require("path");
const fs = require("fs");

const envPath = path.resolve(__dirname, "../../../.env");

console.log("ENV PATH:", envPath);
console.log("EXISTS:", fs.existsSync(envPath));

require("dotenv").config({ path: envPath });

console.log("DB_PASSWORD:", process.env.DB_PASSWORD);