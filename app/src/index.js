import angular from './lib/Angular';

import MatchDirective from './ui/MatchDirective';
import MatchController from './ui/MatchController';

angular.module('Kraken', [
    'ngRoute'
])
.directive('match', MatchDirective)
.controller('MatchController', MatchController)
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/match', {
        	templateUrl: 'views/MatchView.html',
        	controller: 'MatchController'
        })
        .otherwise({
        	redirectTo: '/match'
        });
}]);
