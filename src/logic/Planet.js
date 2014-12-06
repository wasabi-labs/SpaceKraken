const TROOPS_GENERATION_FACTOR = 5;
const TROOPS_HOSTING_FACTOR = 10;

let id = 0;

export default class {
    constructor(player, size) {
        if (! player) {
            throw new Error('Player is mandatory');
        }
        if (size < 1) {
            throw new Error('Size must be bigger than 0');
        }

        this.player = player;
        this.name = 'planet-' + id;
        this.size = size;

        id++;
    }

    get troopsPerTurn() {
        return this.size * TROOPS_GENERATION_FACTOR;
    }

    get maximumTroops() {
        return this.size * TROOPS_HOSTING_FACTOR;
    }

    toString() {
        return this.name;
    }
}