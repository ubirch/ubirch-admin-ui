'use strict';

/**
 * @ngdoc directive
 * @name wtCdbGuiApp.directive:navigation
 * @description
 * # navigation
 */
angular.module('ubirchAdminCrudApp')
  .directive('navigation', function () {
    return {
      templateUrl: 'views/directives/navigation.html',
      restrict: 'E',
      controllerAs: 'navCtrl',
      controller: ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
        // highlighting
        $scope.navClass = function (page) {

          var currentRoute = $location.path().substring(1) || 'devices-list';

          if (currentRoute.indexOf('device-details') === 0){
            currentRoute = 'devices-list';
          }

          return page === currentRoute ? 'active' : '';
        };

         $scope.loadDeviceslist = function () {
          $location.url('/devices-list');
        };

        $scope.loadDevicesMap = function () {
          $location.url('/devices-map');
        };

        $scope.loadAbout = function () {
          $location.url('/about');
        };

        $scope.login = function () {
          $location.path('/login');
        };

        $scope.logout = function () {
          AuthService.signOut();
        };
      }]
    };
  });
