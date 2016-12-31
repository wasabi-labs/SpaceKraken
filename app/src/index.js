import angular from 'angular';
import 'angular-route/angular-route';
import 'angular-toastr/dist/angular-toastr';
import 'angular-toastr/dist/angular-toastr.tpls';

import MatchDirective from './ui/MatchDirective';
import MatchController from './ui/MatchController';

angular.module('Kraken', [
  'ngRoute',
  'toastr'
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
