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
    var defaultDeviceTypeNo = 0;
    var deviceTypes = [
      {
        key: "unknownDeviceTypeKey",
        name: {
          de: "unbekannterDeviceTyp",
          en: "unknownDeviceType"
        },
        icon: "ion-help-circled",
        defaults: {
          properties: {},
          config: {},
          tags: []
        }
      },
      {
        key: "lightsSensorTypeKey",
        name: {
          de: "Lichtsensor",
          en: "lightssensor"
        },
        icon: "ion-ios-lightbulb",
        defaults: {
          properties: {
              countryCode: "unknown"
          },
          config: {
              i: 3600,
              ir: 191,
              s: 0
          },
          tags: []
        }
      },
      {
        key: "temperaturesSensorTypeKey",
        name: {
          de: "Temperatursensor",
          en: "temperaturessensor"
        },
        icon: "ion-thermometer",
        defaults: {
          properties: {
            countryCode: "unknown"
          },
          config: {
            i: 1000,
            s: 0
          },
          tags: []
        }
      },
      {
        key: "noiseSensorTypeKey",
        name: {
          de: "Geräuschsensor",
          en: "noisesensor"
        },
        icon: "ion-mic-c",
        defaults: {
          properties: {
            countryCode: "unknown"
          },
          config: {
            i: 1000,
            s: 0
          },
          tags: []
        }
      },
      {
        key: "waterSensorTypeKey",
        name: {
          de: "Wassersensor",
          en: "watersensor"
        },
        icon: "ion-waterdrop",
        defaults: {
          properties: {
            countryCode: "unknown"
          },
          config: {
            i: 10000,
            s: 0
          },
          tags: []
        }
      },
      {
        key: "customDeviceTypeKey",
        name: {
          de: "eigenerDeviceTyp",
          en: "customdevicetype"
        },
        icon: "ion-radio-waves",
        defaults: {
          properties: {},
          config: {},
          tags: []
        }
      }
    ];

    var getDeviceType4key = function (deviceTypeKey){
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

      getDeviceType: function(deviceTypeKey){
        return getDeviceType4key(deviceTypeKey, defaultDeviceTypeNo);
      },

      getDeviceTypeIcon: function(deviceTypeKey){
        if (defaultDeviceTypeNo === undefined && deviceTypes !== undefined && deviceTypes.length > 0){
          defaultDeviceTypeNo = 0;
        }
        var type = getDeviceType4key(deviceTypeKey);
        return type.icon;
      },

      /**
       * default of default type is the first item in return array of device types
       * @param defaultDeviceTypeNoParam changes the number of the default device type
       */
      setDefaultTypeNo: function(defaultDeviceTypeNoParam) {
        if (defaultDeviceTypeNoParam === undefined && deviceTypes !== undefined && deviceTypes.length > 0){
          defaultDeviceTypeNo = 0;
        }
        else {
          defaultDeviceTypeNo = defaultDeviceTypeNoParam;
        }
      },

      getDefaultType: function () {
          return getDeviceType4key(defaultDeviceTypeNo);
      }

    };
  });
