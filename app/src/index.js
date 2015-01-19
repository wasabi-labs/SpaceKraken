import angular from './lib/Angular';

import SceneDirective from './ui/SceneDirective';
import MatchController from './ui/MatchController';

angular.module('Kraken', [
    'ngRoute'
])
.directive('scene', SceneDirective)
.controller('MatchController', MatchController)
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/match", {
        	templateUrl: "views/MatchView.html", 
        	controller: "MatchController"
        })
        .otherwise({
        	redirectTo: '/match'
        });
}]);
