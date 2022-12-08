const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const config = require("./config.json");
require("dotenv").config();

const authRouter = require("./routers/auth");
const calendarsRouter = require("./routers/calendars");
const eventsRouter = require("./routers/events");
const usersRouter = require("./routers/users");
const filesRouter = require("./routers/files");

const PORT = config.port || 3000;

const server = express();

server.use(express.json());
server.use(cors({ origin: `http://localhost:3000`, credentials: true }));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use("/api/auth", authRouter);
server.use("/api/calendars", calendarsRouter);
server.use("/api/events", eventsRouter);
server.use("/api/users", usersRouter);
server.use("/api/files", filesRouter);

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
