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
        socket.on("AUTH", data => {
            socket.user = new User(socket, data);
            room.addUser(socket, socket.user);
            socket.emit("AUTH_SUCCESS", socket.user.pure());
        });
        socket.on("POST_MESSAGE", data => {
            const msg = new Message(
                socket.user.id,
                data.message,
                socket.user.first_name,
                socket.user.last_name
            );
            room.addMessage(msg);
        });
        socket.on("GET_MESSAGE_ALL", data => {
            socket.emit("NEW_MESSAGE_ALL", {
                messages: room.messages
            });
        });
        socket.on("disconnect", () => {
            room.removeUser(socket.id);
        });
    });
};
