const express = require("express");
const path = require("path");
const expressLogging = require("express-logging");
const logger = require("logops");
const fs = require("fs");
const io = require("socket.io");
const cfg = require("../config.json");
const Room = require("./Room");
const User = require("./User");
const Message = require("./Message");

// loglevel.setLevel()

const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".svg"];

module.exports = () => {
    // create server

    const app = express();
    const ios = io.listen(app.listen(cfg.port, cfg.host));
    const room = new Room(ios);

    app.use(expressLogging(logger));

    app.post("/upload", (req, res) => {
        if (req.headers["x-filename"]) {
            const ext = path.extname(req.headers["x-filename"]).toLowerCase();
            if (!VALID_EXTENSIONS.includes(ext)) {
                res.status(400);
                res.end("Invalid filename extension");
            } else {
                req.pipe(
                    fs.createWriteStream(`./media/${Math.random()}${ext}`)
                );
                req.on("end", () => {
                    res.end("Good file!");
                });
            }
        } else {
            res.status(400);
            res.write("Hello\n");
            res.end("Header X-Filename is required!");
        }
    });

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
