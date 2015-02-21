import Player from '../../src/logic/Player';
import Planet from '../../src/logic/Planet';
import Map from '../../src/logic/Map';
import Match from '../../src/logic/Match';

describe('Match', function() {
    let players;
    let player1;
    let player2;

    let planet1;
    let planet2;
    let planet3;
    let planet4;
    let map;
    let match;

    before(function() {
        player1 = new Player('Fran', '#FF0000');
        player2 = new Player('Roberto', '#0000FF');
        players = [player1, player2];
        planet1 = new Planet(player1, .50);
        planet2 = new Planet(player1, .50);
        planet3 = new Planet(player2, .50);
        planet4 = new Planet(player2, .50);

        map = new Map(10, 10);
        map.addPlanet(planet1, 0, 0);
        map.addPlanet(planet2, 7, 1);
        map.addPlanet(planet3, 5, 4);
        map.addPlanet(planet4, 3, 8);

        map.connect(planet1, planet2);
        map.connect(planet2, planet3);
        map.connect(planet3, planet4);
        map.connect(planet2, planet4);

        match = new Match(players, map)
    });

    it('should have a game map property', function() {
        match.should.have.property('map');
    });

    it('should have a players property', function() {
        match.should.have.property('players');
    });

    it('should have a turnTime property', function() {
        match.should.have.property('turnTime');
    });

    it('should have a currentPlayer property', function() {
        match.should.have.property('currentPlayer');
    });

    it('should begin the match with the first player', function() {
        match.currentPlayer.should.be.eql(player1);
    });

    it('should not be able to move planets which are not of the current player', function() {
        match.move(planet3, planet2, 2).should.be.eql(false);
    });

    it('should not be able to more troops than the planet contains', function() {
        match.move(planet1, planet3, 5000).should.be.eql(false);
    });

    it('should not be able to make a move between planets which are not connected', function() {
        match.move(planet1, planet3, 2).should.be.eql(false);
    });

    it('should be able to add troops to a planet of the same player', function() {
        match.move(planet1, planet2, 2).should.be.eql(true);
    });

    it('should be able to attack an enemy', function() {
        match.move(planet2, planet3, 2).should.be.eql(true);
    });

    it('should not be able to move more troops than the planet contains by making many movements', function() {
        match.move(planet2, planet3, 1).should.be.eql(true);
        match.move(planet2, planet3, 800).should.be.eql(false);
    });

    it('should switch the player when a turn has finished', function() {
        match.next();
        match.currentPlayer.should.be.eql(player2);
        match.next();
        match.currentPlayer.should.be.eql(player1);
        match.next();
        match.currentPlayer.should.be.eql(player2);
        match.next();
        match.currentPlayer.should.be.eql(player1);
    });

});
