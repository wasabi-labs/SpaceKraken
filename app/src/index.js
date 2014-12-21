import Map from './logic/Map';
import Player from './logic/Player';
import Planet from './logic/Planet';

let player = new Player('Fran', '#FF0000');

let planet1 = new Planet(player, 1);
let planet2 = new Planet(player, 1);

let map = new Map(10, 10);
map.addPlanet(planet1, 0, 0);
map.addPlanet(planet2, 9, 9);

console.log(planet1);