const express = require("express");
const expressLogging = require("express-logging");
const logger = require("logops");
const io = require("socket.io");
const bodyParser = require("body-parser");
//
const cfg = require("../config.json");
const Room = require("./Room");
const User = require("./User");
const Message = require("./Message");
const { upload_handler } = require("./handlers");
const addWsRoutes = require("./ws_routes");

// loglevel.setLevel()

module.exports = () => {
    // create server

    const app = express();
    const ios = io.listen(app.listen(cfg.port, cfg.host));
    const room = new Room(ios);
    app.use(expressLogging(logger));
    app.use(bodyParser.raw());
    app.use("/media", express.static("media"));

    app.post("/upload", upload_handler);

    ios.on("connection", socket => {
        addWsRoutes(socket);
    });
};
