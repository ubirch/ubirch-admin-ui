'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.DeviceTypes
 * @description
 * # DeviceTypes
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('DeviceTypes', ['$resource', 'constant', 'settings', '$log', function ($resource, constant, settings, $log) {
    var defaultDeviceTypeNo = 0;

    var url = settings.UBIRCH_API_HOST + constant.AVATAR_SERVICE_REST_ENDPOINT;

    var getDeviceTypeNo4key = function (deviceTypeKey){
      if (deviceTypes.length > 0){
        if (deviceTypeKey !== undefined){
          for (var i = 0; i < deviceTypes.length; i++){
            if (deviceTypes[i].key === deviceTypeKey){
              return i;
            }
          }
        }
        if (defaultDeviceTypeNo !== undefined){
          return defaultDeviceTypeNo;
        }
      }
      return -1;
    };

    var getDeviceType4key = function (deviceTypeKey){
      var index = getDeviceTypeNo4key(deviceTypeKey);
      return index >= 0 ? deviceTypes[index] : undefined;
    };

    var deviceType = $resource(url + '/device/deviceType');

    var deviceTypes = deviceType.query( function(){
      // initialise the default device type
      if (! deviceType.setDefaultType(constant.DEFAULT_DEVICE_TYPE_KEY)){
        $log.warn("Missing default device type!! Please add default device type key in app > scripts > services > constant > DEFAULT_DEVICE_TYPE_KEY");
      }
    });

    deviceType.getDeviceTypeList = function(){
      return deviceTypes;
    };

    deviceType.getDeviceType = function(deviceTypeKey){
        return getDeviceType4key(deviceTypeKey, defaultDeviceTypeNo);
    };

    deviceType.getDeviceTypeIcon = function(deviceTypeKey){
        var type = getDeviceType4key(deviceTypeKey);
        return type.icon;
    };

    /**
     * default of default type is the first item in return array of device types
     * @param defaultDeviceTypeParam changes the default device type
     */
    deviceType.setDefaultType = function(defaultDeviceTypeParam) {
      var index = getDeviceTypeNo4key(defaultDeviceTypeParam);
      defaultDeviceTypeNo = index;
      return index >= 0;
    };

    deviceType.getDefaultType = function () {
          return getDeviceType4key(defaultDeviceTypeNo);
    };

    return deviceType;

  }]);
