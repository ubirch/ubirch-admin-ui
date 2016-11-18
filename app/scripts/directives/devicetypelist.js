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

        scope.$watch('deviceTypeKey', function(newTypeKey){
          scope.selectedDeviceType = $filter('getDeviceType')(scope.deviceTypes, newTypeKey);
        });

        scope.selectType = function(type){
          scope.deviceTypeKey = type.key;
        };
      }
    };
  }]);
