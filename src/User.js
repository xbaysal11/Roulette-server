class User {
    constructor(socket, { first_name, last_name, is_admin = false }) {
        this.id = socket.id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.is_admin = is_admin;
        this.socket = socket;
    }

    pure() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            is_admin: this.is_admin
        };
    }
}

module.exports = User;
