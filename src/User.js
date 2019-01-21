class User {
  constructor(socket, { first_name, last_name }) {
    this.id = socket.id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.socket = socket;
  }

  pure() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name
    };
  }
}

module.exports = User;
