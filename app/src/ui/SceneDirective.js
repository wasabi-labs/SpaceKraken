import Renderer from '../render/MatchRenderer';

export default [function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            match: '='
        },
        template: [
            '<canvas id="renderer"></canvas>'
        ].join('\n'),
        link: function($scope, $element, $attributes) {
            $scope.renderer = new Renderer($element[0], $scope.match);
        },
        controller: ['$scope', function($scope) {

        }]
    };
}];