const sleep = require("sleep-promise");

class Game {
    /**
     * @param {Room} room
     */
    constructor(room) {
        this.room = room;
    }

    async start() {
        this.room.emit("START_GAME");
        console.log("START_GAME");
        await sleep(1000);
        const rand_user = this.room.users[
            Math.floor(Math.random() * this.room.users.length)
        ];
        console.log("END_GAME");
        this.room.emit("END_GAME", rand_user.id);
    }
}

module.exports = Game;
