const DEFAULT_TURN_TIME = 30;

export default class Match {
  constructor(players, map) {
    this.players = players;
    this.map = map;
    this.turnTime = DEFAULT_TURN_TIME;
    this._currentPlayerNumber = 0;
    this._availableMovements = {};
    this._actions = [];

    for (let i = 0; i < players.length; i++){
      this._addTroops(players[i]);
    }
    this._addAvailableMovements(this.currentPlayer);
  }

  get currentPlayer() {
    return this.players[this._currentPlayerNumber];
  }

  isSource(source) {
    if (source.player !== this.currentPlayer) {
      return false;
    }
    if (source.troops <= 1) {
      return false;
    }

    return true;
  }

  isTarget(source, target) {
    if (! this.map.isConnected(source, target)) {
      return false;
    }
    if (this._availableMovements[source.name] < 1) {
      return false;
    }

    return true;
  }

  move(source, target, amount) {
    // Check constraints
    if (! this.isSource(source)) {
      return false;
    }
    if (! this.isTarget(source, target)) {
      return false;
    }
    if (source.troops - amount < 1) {
      return false;
    }
    if (this._availableMovements[source.name] < amount) {
      return false;
    }

    // If the movement is valid, reduce the amount of available troops for the next movement
    this._availableMovements[source] -= amount;

    // Then, enqueue the movent into an action list to resolve it
    // at the end of the turn. Each action will return an object describing
    // what happend, so it can be used to inform the user, show an animation,
    // or whatever.

    // Move troops
    if (source.player === target.player) {
      this._actions.push(function() {
        source.troops -= amount;
        target.troops += amount;

        return {
          event: 'TROOP_MOVEMENT',
          source: source,
          target: target
        }
      });

      return true;
    }

    // Attack a planet
    this._actions.push(function() {
      source.troops -= amount;

      let attackPower = 0;
      let defensePower = 0;
      let i;
      for (i = 0; i < amount; i++) {
        attackPower += Math.floor((Math.random() * 6) + 1);
      }
      for (i = 0; i < target.troops; i++) {
        defensePower += Math.floor((Math.random() * 6) + 1);
      }
      /* Check critics and botchs in each army. By now, it's
         a critic if the attackers gets upper 90% of the possible value
         and a botch if the defenders gets lower than 10%
         This will not check corner cases like 1 troop vs. 20 troops. For
         that cases a variable percentage bases on the number of troops
         should work best.
      */
      if (attackPower > Math.floor(amount * 6 * 0.9)) {
        attackPower = 9999;
      }
      if (defensePower > Math.floor(target.troops * 6 * 0.1)) {
        attackPower = 0;
      }

      if (attackPower > defensePower) {
        target.player(this.currentPlayer);
        target.troops = amount;

        return {
          event: 'ATTACK_SUCCESS',
          source: source,
          target: target
        }
      }

      return {
        event: 'ATTACK_FAIL',
        source: source,
        target: target
      }
    });

    return true;
  }

  next() {
    // Execute enqueued actions by the current player
    let results = [];
    for (let i = 0; i < this._actions.length; i++){
      results.push(this._actions[i]());
    }

    this._actions = [];
    this._currentPlayerNumber = (this._currentPlayerNumber + 1) % this.players.length;
    this._addTroops(this.currentPlayer);
    this._addAvailableMovements(this.currentPlayer);

    return results;
  }

  _addAvailableMovements(player) {
    this._availableMovements = {};
    let planets = this.map.getPlanets(player);
    for (let i = 0; i < planets.length; i++){
      this._availableMovements[planets[i].name] = planets[i].troops;
    }
  }

  _addTroops(player) {
    let planets = this.map.getPlanets(player);
    for (let i = 0; i < planets.length; i++){
      planets[i].troops = Math.min(planets[i].troopsPerTurn + planets[i].troops, planets[i].maximumTroops);
    }
  }
}
