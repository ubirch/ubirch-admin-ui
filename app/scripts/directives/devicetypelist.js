'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:DeviceTypeList
 * @description
 * # DeviceTypeList
 */
angular.module('ubirchAdminCrudApp')
  .directive('devicetypelist',['DeviceTypes', function (DeviceTypes) {
    return {
      templateUrl: 'views/directives/devicetypelist.html',
      restrict: 'E',
      replace: true,
      scope: {deviceTypeKey: '='
      },
      link: function postLink(scope) {
        scope.deviceTypes = DeviceTypes.getDeviceTypeList();
        scope.selectedDeviceType = DeviceTypes.getDeviceType(scope.deviceTypeKey);

        scope.selectType = function(type){
          scope.selectedDeviceType = DeviceTypes.getDeviceType(type.key);
          scope.deviceTypeKey = scope.selectedDeviceType.key;
        };
      }
    };
  }]);
