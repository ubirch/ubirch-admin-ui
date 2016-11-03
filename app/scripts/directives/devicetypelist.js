'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:DeviceTypeList
 * @description
 * # DeviceTypeList
 */
angular.module('ubirchAdminCrudApp')
  .directive('devicetypelist', function () {
    return {
      templateUrl: 'views/directives/devicetypelist.html',
      restrict: 'E',
      replace: true,
      scope: {deviceType: '='
      },
      link: function postLink(scope) {

        scope.deviceTypes = [
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

        var getSelectedDeviceType = function(selectedType) {
          if (scope.deviceTypes.length < 0){
            return undefined;
          }
          if (selectedType !== undefined){
            for (var i = 0; i < scope.deviceTypes.length; i++){
              if (scope.deviceTypes[i].key === selectedType){
                return scope.deviceTypes[i];
              }
            }
          }
          return scope.deviceTypes[scope.defaultDeviceTypeNo];
        };

        scope.defaultDeviceTypeNo = 0;
        scope.selectedDeviceType = getSelectedDeviceType(scope.deviceType);

        scope.selectType = function(type){
          scope.selectedDeviceType = getSelectedDeviceType(type.key);
        };
      }
    };
  });
