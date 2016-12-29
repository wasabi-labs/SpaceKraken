const TROOPS_GENERATION_FACTOR = 20;
const TROOPS_HOSTING_FACTOR = 100;

let id = 0;

export default class Planet {
    constructor(player, size) {
        if (! player) {
            throw new Error('Player is mandatory');
        }
        if (! size || size <= 0 || size > 1 ) {
            throw new Error('Size must be between 0 and 1');
        }

        this.player = player;
        this.name = 'planet-' + id;
        this.size = size;
        this.troops = 0;

        id++;
    }

    get troopsPerTurn() {
        return Math.ceil(this.size * TROOPS_GENERATION_FACTOR);
    }

    get maximumTroops() {
        return Math.ceil(this.size * TROOPS_HOSTING_FACTOR);
    }

    toString() {
        return this.name;
    }
}
