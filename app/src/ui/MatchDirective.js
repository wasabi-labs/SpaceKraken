import jquery from 'jquery';
import {
  Engine,
  Scene,
} from 'babylonjs';

import Map from './Map';
import Hud from './Hud';
import Camera from './Camera';


export default ['toastr', function(toastr) {
  return {
    restrict: 'E',
    replace: true,
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
          0
        );
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
      $scope.engine = new Engine($scope.canvas[0], true);
      $scope.scene = new Scene($scope.engine);

      $scope.map = new Map($scope.scene, $scope.model);
      $scope.hud = new Hud($scope.scene, $scope.map, $scope.model, toastr);
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
