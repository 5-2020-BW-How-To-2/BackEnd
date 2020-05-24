const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("../auth/authRouter.js");
const userRouter = require("../users/userRouter.js");
const hackRouter = require("../hacks/hackRouter.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api", authRouter);
server.use("/api/users", userRouter);
server.use("/api/hacks", hackRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
