'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.DeviceTypes
 * @description
 * # DeviceTypes
 * Service in the ubirchAdminCrudApp.
 */
var app = angular.module('ubirchAdminCrudApp');

app.filter('getDeviceType', ['settings', 'constants', '$log', function(settings, constants, $log) {
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
      if (settings.DEFAULT_DEVICE_TYPE_KEY !== undefined){
        return deviceTypes[settings.DEFAULT_DEVICE_TYPE_KEY];
      }
      else if (constants.DEFAULT_DEVICE_TYPE_KEY !== undefined){
        return deviceTypes[constants.DEFAULT_DEVICE_TYPE_KEY];
      }
      else {
        $log.warn("Missing default device type!! Please add default device type key in settings > DEFAULT_DEVICE_TYPE_KEY");
      }
    }
    return null;
  };
}]);

app.service('DeviceTypes', ['$resource', 'constants', 'settings', '$log', function ($resource, constants, settings, $log) {

    var url = settings.UBIRCH_API_HOST + constants.AVATAR_SERVICE_REST_ENDPOINT;

    var deviceTypeResource = $resource(url + '/device/deviceType');

    var deviceTypes;

    deviceTypeResource.getDeviceTypeList = function(){
      if (deviceTypes === undefined){
        deviceTypes = deviceTypeResource.query( function(){
          if (constants.DEFAULT_DEVICE_TYPE_KEY === undefined){
            $log.warn("Missing default device type!! Please add default device type key in settings > DEFAULT_DEVICE_TYPE_KEY");
          }
        });
      }
      return deviceTypes;
    };

    return deviceTypeResource;

  }]);
