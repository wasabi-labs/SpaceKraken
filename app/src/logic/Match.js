const DEFAULT_TURN_TIME = 30;

export default class {
    constructor(players, map) {
        this.players = players;
        this.map = map;
        this.turnTime = DEFAULT_TURN_TIME;
        this._currentPlayerNumber = 0;
        this._availableMovements = {};
        this._actions = [];

        for(let i = 0; i < players.length; i++){
            this.addTroops(players[i]);
        }
        this.addAvailableMovements(this.currentPlayer);
    }

    addTroops(player) {
        let planets = this.map.getPlanets(player);
        for(let i = 0; i < planets.length; i++){
            planets[i].troops = Math.min(planets[i].troopsPerTurn + planets[i].troops, planets[i].maximumTroops);
        }
    }

    next() {
        // Execute enqueued actions by the current player
        for(let i = 0; i < this._actions.length; i++){
            this._actions[i]();
        }
        this._actions = [];

        this._currentPlayerNumber = (this._currentPlayerNumber + 1) % this.players.length;
        this.addTroops(this.currentPlayer);
        this.addAvailableMovements(this.currentPlayer);
    }

    addAvailableMovements(player) {
        this._availableMovements = {};
        let planets = this.map.getPlanets(player);
        for(let i = 0; i < planets.length; i++){
            this._availableMovements[planets[i].name] = planets[i].troops;
        }
    }

    move(source, target, amount) {
        // check constraints
        if(source.player !== this.currentPlayer || source.troops - amount < 1 || !this.map.isConnected(source, target) || this._availableMovements[source.name] < amount) {
            return false;
        }
        // if the movement is valid, reduce the amount of available troops for the next movement
        this._availableMovements[source] -= amount;

        // and push the movement to action list to resolve it at the end of the turn
        if(source.player === target.player) {
            // move troops
            this._actions.push(function() {
                source.troops -= amount;
                target.troops += amount;
            });
        }
        else {
            // attack
            this._actions.push(function() {
                source.troops -= amount;
                
                let attackPower = 0;
                let defensePower = 0;
                let i;
                for(i = 0; i < amount; i++) {
                    attackPower += Math.floor((Math.random() * 6) + 1);
                }
                for(i = 0; i < target.troops; i++) {
                    defensePower += Math.floor((Math.random() * 6) + 1);
                }
                /* Check critics and botchs in each army. By now, it's
                   a critic if the attackers gets upper 90% of the possible value
                   and a botch if the defenders gets lower than 10%
                   This will not check corner cases like 1 troop vs. 20 troops. For
                   that cases a variable percentage bases on the number of troops
                   should work best.
                */
                if(attackPower > Math.floor(amount * 6 * 0.9)) {
                    attackPower = 9999;
                }
                if(defensePower > Math.floor(target.troops * 6 * 0.1)) {
                    attackPower = 0;
                }
                
                if(attackPower > defensePower) {
                    target.player(this.currentPlayer);
                    target.troops = amount;
                }
            });
        }
        return true;
    }

    get currentPlayer() {
      return this.players[this._currentPlayerNumber];
    }
}
