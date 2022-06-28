const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.listen(3000, async function () {
  console.log("Listening on port 3000");
});
