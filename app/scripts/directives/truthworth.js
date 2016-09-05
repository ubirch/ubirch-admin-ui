'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:truthworth
 * @description
 * # truthworth
 */
angular.module('ubirchAdminCrudApp')
  .directive('truthworth', function () {
    return {
      template: '<i class="sensor-trustworth-icon {{colorClassStr}} ion-record"></i>',
      restrict: 'E',
      replace: true,
      scope: {device: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.colorClassStr = "grey";

        var device = angular.fromJson(attrs.device);

        // TODO: change dummy and get real trustwothness state!!

        switch (device.deviceType) {
          case "lightsSensor":
            scope.colorClassStr = "green";
            break;
          case "temperaturesSensor":
            scope.colorClassStr = "yellow";
            break;
          case "noisesSensor":
            scope.colorClassStr = "red";
            break;
          case "wetnessSensor":
            scope.colorClassStr = "yellow";
            break;
          default:
            scope.colorClassStr = "grey";
        }
      }
    };
  });
