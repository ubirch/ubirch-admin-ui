'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:DeviceTypeList
 * @description
 * # DeviceTypeList
 */
angular.module('ubirchAdminCrudApp')
  .directive('devicetypelist',['DeviceTypes', '$filter', function (DeviceTypes, $filter) {
    return {
      templateUrl: 'views/directives/devicetypelist.html',
      restrict: 'E',
      replace: true,
      scope: {deviceTypeKey: '='
      },
      link: function postLink(scope) {
        scope.deviceTypes = DeviceTypes.getDeviceTypeList();
        scope.selectedDeviceType = $filter('getDeviceType')(scope.deviceTypes, scope.deviceTypeKey);

        scope.selectType = function(type){
          scope.selectedDeviceType =  $filter('getDeviceType')(scope.deviceTypes, type.key);
          scope.deviceTypeKey = scope.selectedDeviceType.key;
        };
      }
    };
  }]);
