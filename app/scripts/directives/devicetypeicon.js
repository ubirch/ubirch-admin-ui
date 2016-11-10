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
        var getIcon = function(newDeviceType){
          scope.iconStr = DeviceTypes.getDeviceTypeIcon(newDeviceType);
        };

        getIcon(scope.deviceType);

        scope.$watch('deviceType', function(newDeviceType){
          getIcon(newDeviceType);
        });
      }
    };
  }]);
