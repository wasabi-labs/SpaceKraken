import Player from '../../src/logic/Player';

describe('Player', function() {
    it('should have a name property', function() {
        var player = new Player('Fran', '#FF0000');
        player.should.have.property('name');
    });
});