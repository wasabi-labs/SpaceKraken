import Player from '../../src/logic/Player';
import Planet from '../../src/logic/Planet';

describe('Planet', function() {
    let player;
    let planet;

    before(function() {
        player = new Player('Fran', '#FF0000');
        planet = new Planet(player, 10);
    });

    it('must require a player', function() {
        (function() {
            return new Planet(null, 10);
        })
        .should.throw();
    });

    it('must require a size', function() {
        (function() {
            return new Planet(player);
        })
        .should.throw();
        (function() {
            return new Planet(player, 0);
        })
        .should.throw();
    });

    it('should have a name property', function() {
        planet.should.have.property('name');
    });

    it('should generate a new name per planet', function() {
        let other = new Planet(player, 10);
        planet.name.should.not.be.eql(other.name);
    });

    it('should have a player property', function() {
        planet.should.have.property('player');
    });

    it('should have a size property', function() {
        planet.should.have.property('size');
    });

    it('should have a troopsPerTurn property', function() {
        planet.should.have.property('troopsPerTurn');
    });

    it('should have a maximumTroops property', function() {
        planet.should.have.property('maximumTroops');
    });

    it('should calculate the troop generation factor ', function() {
        planet.troopsPerTurn.should.be.eql(planet.size * 5);
    });

    it('should calculate the troop hosting factor', function() {
        planet.maximumTroops.should.be.eql(planet.size * 10);
    });
});