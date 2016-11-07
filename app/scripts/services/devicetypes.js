'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.DeviceTypes
 * @description
 * # DeviceTypes
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('DeviceTypes', function () {
    var deviceTypes = [
      {
        key: "unknownDeviceTypeKey",
        name: {
          de: "unbekannterDeviceTyp",
          en: "unknownDeviceType"
        },
        icon: "ion-help-circled"
      },
      {
        key: "lightsSensorTypeKey",
        name: {
          de: "Lichtsensor",
          en: "lightssensor"
        },
        icon: "ion-ios-lightbulb"
      },
      {
        key: "temperaturesSensorTypeKey",
        name: {
          de: "Temperatursensor",
          en: "temperaturessensor"
        },
        icon: "ion-thermometer"
      },
      {
        key: "noiseSensorTypeKey",
        name: {
          de: "Geräuschsensor",
          en: "noisesensor"
        },
        icon: "ion-mic-c"
      },
      {
        key: "waterSensorTypeKey",
        name: {
          de: "Wassersensor",
          en: "watersensor"
        },
        icon: "ion-waterdrop"
      },
      {
        key: "customDeviceTypeKey",
        name: {
          de: "eigenerDeviceTyp",
          en: "customdevicetype"
        },
        icon: "ion-radio-waves"
      }
    ];

    var getDeviceType4key = function (deviceTypeKey, defaultDeviceTypeNo){
      if (deviceTypes.length > 0){
        if (deviceTypeKey !== undefined){
          for (var i = 0; i < deviceTypes.length; i++){
            if (deviceTypes[i].key === deviceTypeKey){
              return deviceTypes[i];
            }
          }
        }
        if (defaultDeviceTypeNo !== undefined){
          return deviceTypes[defaultDeviceTypeNo];
        }
      }
      return undefined;
    };

    return {
      getDeviceTypeList: function(){
        return deviceTypes;
      },

      getDeviceType: function(deviceTypeKey, defaultDeviceTypeNo){
        return getDeviceType4key(deviceTypeKey, defaultDeviceTypeNo);
      },

      getDeviceTypeIcon: function(deviceTypeKey, defaultDeviceTypeNo){
        if (defaultDeviceTypeNo === undefined && deviceTypes !== undefined && deviceTypes.length > 0){
          defaultDeviceTypeNo = 0;
        }
        var type = getDeviceType4key(deviceTypeKey, defaultDeviceTypeNo);
        return type.icon;
      }

    };
  });
