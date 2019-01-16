const io = require("socket.io");
const cfg = require("./config.json");
// create server
const ios = io(cfg.port);
let users = [];

ios.on("connection", socket => {
  socket.on("AUTH", data => {
    const user = {
      id: socket.id,
      firstName: data.firstName,
      lastName: data.lastName,
      admin: !users.length
    };
    const already_added = users.find(u => u.id === socket.id);
    if (already_added) return;
    users.push(user);
    console.log(`(new user) Ln: ${user.lastName}`);
    ios.emit("CHANGE_USERS_LIST", {
      users: users
    });
  });
  socket.on("disconnect", () => {
    users = users.filter(u => u.id !== socket.id);
    ios.emit("CHANGE_USERS_LIST", {
      users: users
    });
  });
});
