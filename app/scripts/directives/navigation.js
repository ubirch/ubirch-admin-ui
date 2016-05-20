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

          var currentRoute = $location.path().substring(1) || 'home';

          if (currentRoute.indexOf('device-details') === 0){
            currentRoute = 'device-details';
          }

          return page === currentRoute ? 'active' : '';
        };

        $scope.loadHome = function () {
          $location.url('/home');
        };

        $scope.loadDeviceCRUD = function () {
          $location.url('/device-crud');
        };

        $scope.loadDeviceslist = function () {
          $location.url('/devices-list');
        };

        $scope.loadAbout = function () {
          $location.url('/about');
        };
      }]
    };
  });
