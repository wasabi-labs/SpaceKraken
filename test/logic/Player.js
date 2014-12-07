import Player from '../../src/logic/Player';

describe('Player', function() {
    let player;

    before(function() {
        player = new Player('Fran', '#FF0000');
    });

    it('should have a name property', function() {
        player.should.have.property('name');
    });

    it('should have a color property', function() {
        player.should.have.property('color');
    });
});