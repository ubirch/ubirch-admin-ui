'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:devicetype
 * @description
 * # devicetype
 */
angular.module('ubirchAdminCrudApp')
  .directive('devicetypeicon', [ 'DeviceTypes', function (DeviceTypes) {
    return {
      template: '<i class="sensor-type-icon {{iconStr}}"></i>',
      restrict: 'E',
      replace: true,
      scope: {deviceType: '@'
      },
      link: function postLink(scope) {
        scope.iconStr = DeviceTypes.getDeviceTypeIcon(scope.deviceType);
      }
    };
  }]);
