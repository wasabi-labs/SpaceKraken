import Renderer from '../render/MatchRenderer';

export default [function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            match: '='
        },
        template: [
            '<div class="scene">',
            '    <canvas class="renderer"></canvas>',
            '    <ng-transclude></ng-transclude>',
            '</div>'
        ].join('\n'),
        link: function($scope, $element, $attributes) {
            let canvas = $element.find('canvas')[0];
            $scope.renderer = new Renderer(canvas, $scope.match);
        },
        controller: ['$scope', function($scope) {

        }]
    };
}];