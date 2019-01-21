const crypto = require("crypto");

class Room {
  constructor(ios) {
    this.users = [];
    this.messages = [];
    this.ios = ios;
    this.id = crypto.randomBytes(5).toString("hex");
  }

  emit(event, data) {
    this.ios.in(this.id).emit(event, data);
  }

  addUser(socket, user) {
    if (this.hasUser(user.id)) return;
    this.users.push(user);
    socket.join(this.id);
    console.log(`(new user) Ln: ${user.last_name}`);
    this.emit("CHANGE_USERS_LIST", {
      users: this.users.map(u => u.pure())
    });
  }

  removeUser(user_id) {
    this.users = this.users.filter(u => u.id !== user_id);
    this.emit("CHANGE_USERS_LIST", {
      users: this.users.map(u => u.pure())
    });
  }

  hasUser(user_id) {
    const already_added = this.users.find(u => u.id === user_id);
    return !!already_added;
  }

  addMessage(msg) {
    this.messages.push(msg);
    this.emit("NEW_MESSAGE", msg);
  }
}

module.exports = Room;
