const io = require("socket.io");
const cfg = require("../config.json");
const Room = require("./Room");
const User = require("./User");
const Message = require("./Message");

module.exports = () => {
  // create server
  const ios = io(cfg.port);
  const room = new Room(ios);

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
