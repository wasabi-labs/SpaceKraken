import jquery from '../lib/JQuery';
import Babylon from '../lib/Babylon';

class Map {
    constructor(scene, match) {
        this.scene = scene;
        this.match = match;

        // Light
        this.light = new Babylon.HemisphericLight('AmbientLight', new Babylon.Vector3(0, 1, 0), this.scene);
        this.light.intensity = 0.75;
        this.scene.clearColor = new Babylon.Color3(0, 0, 0);

        // Materials
        let materials = {
            planet: new Babylon.StandardMaterial("PlanetMaterial", this.scene),
            path: new Babylon.StandardMaterial("PathMaterial", this.scene),
            ground: new Babylon.StandardMaterial("GroundMaterial", this.scene)
        }

        let placeholder = 'textures/placeholder.png';
        materials.planet.diffuseColor = new Babylon.Color3(0.2, 0.6, 1.0);
        materials.planet.ambientTexture = new Babylon.Texture(placeholder, this.scene);
        materials.path.diffuseColor = new Babylon.Color3(0.75, 1.0, 0.75);
        materials.path.ambientTexture = new Babylon.Texture(placeholder, this.scene);
        materials.path.alpha = 0.5;
        materials.ground.wireframe = true;

        // Map
        let map = this.match.map;
        map.getPlanets().forEach(planet => {
            let position = map.getPosition(planet);

            // Planets
            let sphere = Babylon.Mesh.CreateSphere(planet.name, 8, planet.size, this.scene);

            sphere.planet = planet;
            sphere.material = materials.planet;
            sphere.position.x = - (map.width / 2) + position.x;
            sphere.position.z = - (map.height / 2) + position.y;

            // Paths
            // FIXME: Each connection is drawn twice!
            let connections = map.getConnections(planet);
            connections.forEach(connection => {
                let other = map.getPosition(connection);

                let dx = position.x - other.x;
                let dy = position.y - other.y;
                let hy = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

                let path = Babylon.Mesh.CreatePlane(planet.name + connection.name + 'Path', 1, this.scene);
                path.material = materials.path;
                path.parent = sphere;

                path.position.x = - dx / 2;
                path.position.z = - dy / 2;
                path.rotation.y = - Math.asin(Math.abs(dy) / hy);
                path.rotation.x = Math.PI / 2;
                path.scaling.x = hy;
                path.scaling.y = 0.1;
            })
        });

        // Debug ground
        let ground = Babylon.Mesh.CreateGround('Ground', map.width, map.height, Math.max(map.width, map.height), this.scene);
        ground.material = materials.ground;
    }

    render() {
        // Pass
    }

    dispose() {
        // Pass
    }
}

class Hud {
    constructor(canvas, scene, match, toastr) {
        this.canvas = canvas;
        this.scene = scene;
        this.match = match;
        this.toastr = toastr;

        this.selection = null;
        this._click = () => {
            let ray = scene.pick(scene.pointerX, scene.pointerY);
            if (! ray.hit) {
                return;
            }

            let mesh = ray.pickedMesh;

            // Selection command
            if (! this.selection) {
                this.selection = mesh;
                return;
            }
            // Deselection command
            if (this.selection === mesh) {
                this.selection = null;
                return;
            }
            // Movement command
            let source = this.selection.planet;
            let target = mesh.planet;
            this._move(source, target);
            this.selection = null;
        };

        this.canvas.on('click', this._click);
    }

    _move(source, target) {
        console.log(source);
        this.match.move(source, target, 1);

        if (source.player === target.player) {
            this.toastr.info('Movement enqueued')
        }
        else {
            this.toastr.warning('Attack enqueued')
        }
    }

    render() {
        // Pass
    }

    dispose() {
        this.canvas.off('click', this._click);
    }
}

class Camera {
    constructor(canvas, scene) {
        this.camera = new Babylon.FreeCamera('FreeCamera', new Babylon.Vector3(0, 5, -10), scene);
        this.camera.setTarget(Babylon.Vector3.Zero());
        this.camera.attachControl(canvas[0], false);
    }

    render() {
        // Pass
    }

    dispose() {
        // Pass
    }
}

export default ['toastr', function(toastr) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            model: '='
        },
        template: [
            '<div class="scene">',
            '    <canvas class="renderer"></canvas>',
            '    <div class="topLeftHud">',
            '        <h1>{{ clock }}</h1>',
            '        <h2>{{ name }}</h2>',
            '    </div>',
            '    <div class="topRightHud">',
            '    </div>',
            '    <div class="bottomLeftHud">',
            '    </div>',
            '    <div class="bottomRightHud">',
            '        <button ng-click="endTurn()">',
            '            End turn',
            '        </button>',
            '    </div>',
            '</div>'
        ].join('\n'),
        controller: ['$scope', '$interval', function($scope, $interval) {

            // Set a clock to show the remaining turn time and force
            // a turn end when the clock reaches 0.
            $scope.clock = $scope.model.turnTime;
            $scope.name = $scope.model.currentPlayer.name;

            let start = Date.now();
            let timer = $interval(function() {
                let tick = Date.now();
                $scope.clock = Math.max(
                    $scope.model.turnTime - Math.round((tick - start) / 1000),
                    0);
                if ($scope.clock === 0) {
                    $scope.endTurn();
                }
            }, 250);
            $scope.$on('$destroy', function() {
                $interval.cancel(timer);
            });

            // On each turn end, update the UI for the next
            // player.
            $scope.endTurn = function() {
                let actions = $scope.model.next();

                // For each player action notify the result,
                // play an animation, etc.
                actions.forEach(function(action) {
                    console.log(action);
                });

                start = Date.now();

                $scope.clock = $scope.model.turnTime;
                $scope.name = $scope.model.currentPlayer.name;
                toastr.success('New turn')
            }
        }],
        link: function($scope, $element, $attributes) {
            $scope.canvas = $element.find('canvas');
            $scope.engine = new Babylon.Engine($scope.canvas[0], true);
            $scope.scene = new Babylon.Scene($scope.engine);

            $scope.map = new Map($scope.scene, $scope.model);
            $scope.hud = new Hud($scope.canvas, $scope.scene, $scope.model, toastr);
            $scope.camera = new Camera($scope.canvas, $scope.scene)

            $scope.engine.runRenderLoop(() => {
                $scope.scene.render();
                $scope.map.render();
                $scope.hud.render();
                $scope.camera.render();
            });

            $scope.$on('$destroy', () => {
                $scope.map.dispose();
                $scope.hud.dispose();
                $scope.camera.dispose();
                $scope.engine.dispose();
            });

            let resizer = () => {
                $scope.engine.resize();
            };
            jquery(window).on('resize', resizer);
            $scope.$on('$destroy', () => {
               jquery(window).off('resize', resizer);
            });
        }
    };
}];
