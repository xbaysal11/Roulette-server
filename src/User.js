class User {
  constructor(socket, { firstName, lastName }) {
    this.id = socket.id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.socket = socket;
  }

  pure() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName
    };
  }
}

module.exports = User;
