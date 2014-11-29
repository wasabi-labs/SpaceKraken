export default class {
	constructor(width, height) {
		if (width < 1) {
			throw new Error('Width must be bigger than 0');
		}
		if (height < 1) {
			throw new Error('Height must be bigger than 0');
		}

		this.width = width;
		this.height = height;
		this._planets = {};
  		this._connections = {};
	}

	addPlanet(planet, x, y) {
  		if (x < 0 || x >= this.width) {
    		throw new Error('X is out of bounds');
    	}
		if (y < 0 || y >= this.height) {
		    throw new Error('Y is out of bounds');
		}
		  
		this._planets[planet.name] = {
			planet: planet,
			position: {
		    	x: x,
		    	y: y
			}
		};
	}

    connect(planet1, planet2) {
  		if (this._planets[planet1.name] === undefined) {
    		throw new Error('Planet1 not in Map');
  		}
		if (this._planets[planet2.name] === undefined) {
		    throw new Error('Planet2 not in Map');
		}
		if (this._connections[planet1.name] === undefined) {
		    this._connections[planet1.name] = {}; 
		}
		if (this._connections[planet2.name] === undefined) {
		    this._connections[planet2.name] = {};  
		}
		  
		this._connections[planet1.name][planet2.name] = true;
		this._connections[planet2.name][planet1.name] = true;
    }

	isConnected(planet1, planet2) {
  		return this._connection[planet1.name][planet2.name];
  	}

	getConnections(planet) {
  		return this._connections[planet.name];
    }

	getPosition(planet) {
		return this._planets[planet.name].position;
	}
  
    getPlanets(player) {
	    let result = [];

	    Object.keys(this._planets).forEach(function(key) {
	    	let planet = this._planets[key].planet;
	    	if (planet.player === player) {
	    		result.push(planet);
	    	}
	    });
	  
	    return result;
	}
}