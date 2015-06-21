import jquery from '../lib/JQuery';
import Babylon from '../lib/Babylon';

function factory(canvas, engine, match) {
    let scene = new Babylon.Scene(engine);
    scene.clearColor = new Babylon.Color3(0, 0, 0);

    // Camera
    let camera = new Babylon.FreeCamera('camera1', new Babylon.Vector3(0, 5, -10), scene);
    camera.setTarget(Babylon.Vector3.Zero());
    camera.attachControl(canvas, false);

    // Light
    let light = new Babylon.HemisphericLight('light1', new Babylon.Vector3(0, 1, 0), scene);
    light.intensity = 0.75;

    // Materials
    let materials = {
        planet: new Babylon.StandardMaterial("planetMaterial", scene),
        path: new Babylon.StandardMaterial("pathMaterial", scene),
        ground: new Babylon.StandardMaterial("groundMaterial", scene)
    }

    let placeholder = 'textures/placeholder.png';
    materials.planet.diffuseColor = new Babylon.Color3(0.2, 0.6, 1.0);
    materials.planet.ambientTexture = new Babylon.Texture(placeholder, scene);
    materials.path.diffuseColor = new Babylon.Color3(0.75, 1.0, 0.75);
    materials.path.ambientTexture = new Babylon.Texture(placeholder, scene);
    materials.path.alpha = 0.5;
    materials.ground.wireframe = true;

    // Map
    let map = match.map;
    map.getPlanets().forEach(planet => {
        let position = map.getPosition(planet);

        // Planets
        let sphere = Babylon.Mesh.CreateSphere(planet.name, 8, planet.size, scene);
        
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

            let path = Babylon.Mesh.CreatePlane(planet.name + connection.name + 'Path', 1, scene);
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
    let ground = Babylon.Mesh.CreateGround('ground', map.width, map.height, Math.max(map.width, map.height), scene);
    ground.material = materials.ground;

    return scene;
}

export default [function() {
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
            '    <ng-transclude></ng-transclude>',
            '</div>'
        ].join('\n'),
        controller: ['$scope', 'toastr', function($scope, toastr) {
            $scope.selection = null;
            $scope.select = function(mesh) {
                if (! $scope.selection) {
                    $scope.selection = mesh;
                }
                else if ($scope.selection === mesh) {
                    $scope.selection = null;
                }
                else {
                    let source = $scope.selection.planet;
                    let target = mesh.planet;

                    $scope.model.move(source, target, 1);

                    if (source.player === target.player) {
                        toastr.info('Movement enqueued')
                    }
                    else {
                        toastr.warning('Attack enqueued')
                    }

                    $scope.selection = null;
                    
                }
            };
        }],
        link: function($scope, $element, $attributes) {
            $scope.canvas = $element.find('canvas');
            $scope.engine = new Babylon.Engine($scope.canvas[0], true);
            $scope.scene = factory($scope.canvas[0], $scope.engine, $scope.model);

            $scope.engine.runRenderLoop(() => {
                $scope.scene.render();
            });

            let resizer = () => {
                $scope.engine.resize();
            };
            let clicker = () => {
                let result = $scope.scene.pick($scope.scene.pointerX, $scope.scene.pointerY);
                if (result.hit) {
                    $scope.select(result.pickedMesh);
                }
            };
            
            jquery(window).on('resize', resizer);
            $scope.canvas.on('click', clicker);

            $scope.$on('$destroy', () => {
                jquery(window).off('resize', resizer);
                $scope.canvas.off('click', clicker);
                $scope.engine.dispose();
            });
        }
    };
}];