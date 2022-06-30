const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRouter = require("./router/user_router");

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
dotenv.config();
app.listen(3000, async function () {
  console.log("Listening on port 3000");
});
