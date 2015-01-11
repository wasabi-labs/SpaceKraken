import Player from '../../src/logic/Player';
import Planet from '../../src/logic/Planet';
import Map from '../../src/logic/Map';

describe('Planet', function() {
    let player1;
    let player2;
    let planet1;
    let planet2;
    let planet3;

    before(function() {
        player1 = new Player('Fran', '#FF0000');
        player2 = new Player('Roberto', '#0000FF');
        planet1 = new Planet(player1, 10);
        planet2 = new Planet(player1, 10);
        planet3 = new Planet(player2, 10);
    });

    it('must require a size', function() {
        (function() {
            return new Map();
        })
        .should.throw();
        (function() {
            return new Map(0, 0);
        })
        .should.throw();
        (function() {
            return new Map(10);
        })
        .should.throw();
        (function() {
            return new Map(10, 0);
        })
        .should.throw();
    });

    it('should have a width property', function() {
        let map = new Map(10, 10);
        map.should.have.property('width');
    });

    it('should have a height property', function() {
        let map = new Map(10, 10);
        map.should.have.property('height');
    });

    it('should be able to add planets', function() {
        let map = new Map(10, 10);

        map.addPlanet(planet1, 0, 0);
        map.addPlanet(planet2, 5, 5);
        map.addPlanet(planet3, 9, 9);

        let planets = map.getPlanets();

        planets.should.have.length(3);
        planets.should.containEql(planet1);
        planets.should.containEql(planet2);
        planets.should.containEql(planet3);
    });

    it('should be able to retrieve planets from a specific player', function() {
        let map = new Map(10, 10);

        map.addPlanet(planet1, 0, 0);
        map.addPlanet(planet2, 5, 5);
        map.addPlanet(planet3, 9, 9);
        
        let planets = map.getPlanets(player2);

        planets.should.have.length(1);
        planets.should.containEql(planet3);
    });

    it('should check bounds when adding planets', function() {
        let map = new Map(10, 10);
        
        (function() {
            map.addPlanet(planet1);
        })
        .should.throw();
        (function() {
            map.addPlanet(planet1, 0);
        })
        .should.throw();
        (function() {
            map.addPlanet(planet1, -10, 0);
        })
        .should.throw();
        (function() {
            map.addPlanet(planet1, 0, -10);
        })
        .should.throw();
        (function() {
            map.addPlanet(planet1, 100, 0);
        })
        .should.throw();
        (function() {
            map.addPlanet(planet1, 0, 100);
        })
        .should.throw();
    });

    it('should return the position of an added planet', function() {
        let map = new Map(10, 10);

        map.addPlanet(planet1, 2, 3);
        
        map.getPosition(planet1).should.be.eql({
            x: 2,
            y: 3
        });
    });

    it('should be able to connect planets', function() {
        let map = new Map(10, 10);

        map.addPlanet(planet1, 0, 0);
        map.addPlanet(planet2, 5, 5);
        map.addPlanet(planet3, 9, 9);

        map.connect(planet1, planet2);

        map.isConnected(planet1, planet2).should.be.true;
        map.isConnected(planet2, planet1).should.be.true;
        map.isConnected(planet1, planet3).should.be.false;
    });

    it('should return the connections of the added planets', function() {
        let map = new Map(10, 10);

        map.addPlanet(planet1, 0, 0);
        map.addPlanet(planet2, 5, 5);

        map.connect(planet1, planet2);

        map.getConnections(planet1).should.be.eql([planet2]);
    });
});