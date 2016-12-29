import angular from 'angular';

import Map from '../logic/Map';
import Match from '../logic/Match';
import Player from '../logic/Player';
import Planet from '../logic/Planet';

export default ['$scope', function($scope) {
    // Initialize a sample match
    let player1 = new Player('Fran', '#FF0000');
    let player2 = new Player('Roberto', '#0000FF');

    let small = 0.3;
    let medium = 0.6;
    let big = 1;

    let planet1 = new Planet(player1, small);
    let planet2 = new Planet(player1, medium);
    let planet3 = new Planet(player1, medium);
    let planet4 = new Planet(player1, big);

    let planet5 = new Planet(player2, small);
    let planet6 = new Planet(player2, medium);
    let planet7 = new Planet(player2, medium);
    let planet8 = new Planet(player2, big);
    let planet9 = new Planet(player2, big);

    let map = new Map(20, 20);

    map.addPlanet(planet1, 0, 0);
    map.addPlanet(planet2, 5, 3);
    map.addPlanet(planet3, 10, 8);
    map.addPlanet(planet4, 4, 6);
    map.addPlanet(planet5, 19, 19);
    map.addPlanet(planet6, 15, 14);
    map.addPlanet(planet7, 10, 12);
    map.addPlanet(planet8, 17, 17);
    map.addPlanet(planet9, 15, 9);

    map.connect(planet1, planet2);
    map.connect(planet1, planet4);
    map.connect(planet2, planet3);
    map.connect(planet3, planet4);
    map.connect(planet3, planet6);
    map.connect(planet3, planet7);
    map.connect(planet3, planet9);
    map.connect(planet7, planet6);
    map.connect(planet7, planet8);
    map.connect(planet8, planet5);
    map.connect(planet8, planet6);
    map.connect(planet8, planet9);

    let players = [player1, player2];
    $scope.match = new Match(players, map);
}];
