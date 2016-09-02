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
      templateUrl: 'views/navigation.html',
      restrict: 'E',
      controllerAs: 'navCtrl',
      controller: ['$scope', '$location', function ($scope, $location) {
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
      }]
    };
  });
