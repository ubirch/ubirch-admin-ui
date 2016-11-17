'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.DeviceTypes
 * @description
 * # DeviceTypes
 * Service in the ubirchAdminCrudApp.
 */
var app = angular.module('ubirchAdminCrudApp');

app.filter('getDeviceType', ['constant', '$log', function(constant, $log) {
  return function(deviceTypes, deviceTypeKey) {
    if (deviceTypes !== undefined && deviceTypes.length > 0){
      if (deviceTypeKey !== undefined){
        var i = 0, len = deviceTypes.length;
        for (; i < len; i++){
          if (deviceTypes[i].key === deviceTypeKey){
            return deviceTypes[i];
          }
        }
      }
      if (constant.DEFAULT_DEVICE_TYPE_KEY !== undefined){
        return deviceTypes[constant.DEFAULT_DEVICE_TYPE_KEY];
      }
      else {
        $log.warn("Missing default device type!! Please add default device type key in app > scripts > services > constant > DEFAULT_DEVICE_TYPE_KEY");
      }
    }
    return null;
  };
}]);

app.service('DeviceTypes', ['$resource', 'constant', 'settings', '$log', function ($resource, constant, settings, $log) {

    var url = settings.UBIRCH_API_HOST + constant.AVATAR_SERVICE_REST_ENDPOINT;

    var deviceTypeResource = $resource(url + '/device/deviceType');

    var deviceTypes;

  deviceTypeResource.getDeviceTypeList = function(){
      if (deviceTypes === undefined){
        deviceTypes = deviceTypeResource.query( function(){
          if (constant.DEFAULT_DEVICE_TYPE_KEY === undefined){
            $log.warn("Missing default device type!! Please add default device type key in app > scripts > services > constant > DEFAULT_DEVICE_TYPE_KEY");
          }
        });
      }
      return deviceTypes;
    };

    return deviceTypeResource;

  }]);
