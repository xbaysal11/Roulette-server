const User = require("./User");
const Message = require("./Message");
const Room = require("./Room");
const Game = require("./Game");

const handleAuth = (socket, data) => {
    socket.user = new User(socket, data);
    Room.getById(123).addUser(socket, socket.user);
    socket.emit("AUTH_SUCCESS", socket.user.pure());
};

const handlePostMessage = (socket, data) => {
    if (!socket.user || !socket.user.id) return;
    const msg = new Message(
        socket.user.id,
        data.message,
        socket.user.first_name,
        socket.user.last_name
    );
    Room.getById(123).addMessage(msg);
};

const handleGetMessageAll = (socket, data) => {
    socket.emit("NEW_MESSAGE_ALL", {
        messages: Room.getById(123).messages
    });
};

const handleDisconnect = socket => {
    Room.getById(123).removeUser(socket.id);
};

const handleStartGame = socket => {
    if (!socket.user || !socket.user.is_admin) return;
    const game = new Game(Room.getById(123));
    game.start();
};

const addRoutes = socket => {
    socket.on("AUTH", handleAuth.bind(null, socket));
    socket.on("POST_MESSAGE", handlePostMessage.bind(null, socket));
    socket.on("GET_MESSAGE_ALL", handleGetMessageAll.bind(null, socket));
    socket.on("POST_START_GAME", handleStartGame.bind(null, socket));
    socket.on("disconnect", handleDisconnect.bind(null, socket));
};

module.exports = addRoutes;
