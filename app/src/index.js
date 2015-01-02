import Map from './logic/Map';
import Player from './logic/Player';
import Planet from './logic/Planet';

import jquery from './lib/JQuery';
import Babylon from './lib/Babylon';

let player = new Player('Fran', '#FF0000');

let planet1 = new Planet(player, 1);
let planet2 = new Planet(player, 1);

let map = new Map(10, 10);
map.addPlanet(planet1, 0, 0);
map.addPlanet(planet2, 9, 9);

let canvas = document.getElementById("render");
let engine = new Babylon.Engine(canvas, true);

let scene = (function() {
    let scene = new Babylon.Scene(engine);
    scene.clearColor = new Babylon.Color3(0, 0, 0);

    let camera = new Babylon.FreeCamera("camera1", new Babylon.Vector3(0, 5, -10), scene);
    camera.setTarget(Babylon.Vector3.Zero());
    camera.attachControl(canvas, false);

    let light = new Babylon.HemisphericLight("light1", new Babylon.Vector3(0, 1, 0), scene);
    light.intensity = .5;

    let sphere = Babylon.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.y = 1;

    let ground = Babylon.Mesh.CreateGround("ground1", 6, 6, 2, scene);

    return scene;
})();

engine.runRenderLoop(function() {
    scene.render();
});
jquery(window).on('resize', function() {
    engine.resize();
});
