const io = require("socket.io");
const cfg = require("../config.json");
const Room = require("./Room");
const User = require("./User");

module.exports = () => {
  // create server
  const ios = io(cfg.port);
  const room = new Room(ios);

  ios.on("connection", socket => {
    socket.on("AUTH", data => {
      const user = new User(socket, data);
      room.addUser(socket, user);
      socket.emit("AUTH_SUCCESS", user.pure());
    });
    socket.on("disconnect", () => {
      room.removeUser(socket.id);
    });
  });
};
