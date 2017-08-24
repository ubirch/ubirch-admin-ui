'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:map
 * @description
 * # map
 */
angular.module('ubirchAdminCrudApp')
  .directive('map', [ function () {
    return {
      templateUrl: 'views/directives/map.html',
      restrict: 'E',
      replace: true,
      $scope: {
        devices: '='
      },
      link: function (scope) {
        var centerLat = parseFloat(59.91);
        var centerLng = parseFloat(10.75);

        scope.center = {
          lat: centerLat,
          lng: centerLng,
          zoom: 15
        };

        scope.markers = {
          marker: {
            lat: centerLat,
            lng: centerLng,
            focus: true,
            draggable: false
          }
        };
      }
    };
  }]);
