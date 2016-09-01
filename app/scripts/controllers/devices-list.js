'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DevicesListCtrl
 * @description
 * # DevicesListCtrl
 * Controller of the ubirchAdminCrudApp
 */
var app = angular.module('ubirchAdminCrudApp');

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

app.controller('DevicesListCtrl', [ '$scope', '$location', function ($scope, $location) {

    $scope.devices = [
      {
        "created": "2016-04-29T13:48:46.403Z",
        "deviceConfig": {
          "i": 3600,
          "ir": 191,
          "s": 0
        },
        "deviceId": "0c5a19bf-194c-40ea-bf46-0416a176aedb",
        "deviceName": "lightsSensor_LU_8caa2520-d8f0-4c85-9705-4707054f4e11",
        "deviceProperties": {
          "countryCode": "LU"
        },
        "deviceType": "lightsSensor",
        "hwDeviceId": "860719022152999",
        "subscriptions": [],
        "tags": [      "ubirch#0",       "sensor"    ],
        "updated": "2016-04-29T13:48:46.405Z",
        "deviceLastUpdated": "2016-04-29T13:48:46.405Z",
        "avatarLastUpdated": "2016-04-29T13:48:46.405Z",
        "syncState" : "insync",
        "avatarState": {
          "desired": {
            "i": 1800,
            "bf": 1,
            "r": 13944,
            "g": 21696,
            "b": 17840
          },
          "reported": {
            "la": "52.502769",
            "lo": "13.477947",
            "ba": 13,
            "lp": 55,
            "e": 0,
            "i": 1800,
            "bf": 1,
            "r": 13944,
            "g": 21696,
            "b": 17840
          }
        }
      },
      {
        "created": "2016-04-29T13:48:46.403Z",
        "deviceConfig": {
          "i": 3600,
          "ir": 191,
          "s": 0
        },
        "deviceId": "0c5a19bf-194c-40ea-bf46-0416a176aedb",
        "deviceName": "temperaturesSensor_TU_8caa2520-d8f0-4c85-9705-4707054f4e11",
        "deviceProperties": {
          "countryCode": "LU"
        },
        "deviceType": "temperaturesSensor",
        "hwDeviceId": "860719022152999",
        "subscriptions": [],
        "tags": [      "ubirch#2",       "sensor"    ],
        "updated": "2016-04-29T13:48:46.405Z",
        "deviceLastUpdated": "2016-04-29T13:48:46.405Z",
        "avatarLastUpdated": "2016-04-29T13:48:46.405Z",
        "syncState" : "outofsync",
        "avatarState": {
          "desired": {
            "i": 1800,
            "bf": 1,
            "r": 13944,
            "g": 21696,
            "b": 17840
          },
          "reported": {
            "la": "52.502769",
            "lo": "13.477947",
            "ba": 13,
            "lp": 55,
            "e": 0,
            "i": 1800,
            "bf": 1,
            "r": 13944,
            "g": 21696,
            "b": 17840
          }
        }
      },
      {
        "created": "2016-04-29T13:48:46.403Z",
        "deviceConfig": {
          "i": 3600,
          "ir": 191,
          "s": 0
        },
        "deviceId": "0c5a19bf-194c-40ea-bf46-0416a176aedb",
        "deviceName": "machineSensor_WM_8caa2520-d8f0-4c85-9705-4707054f4e11",
        "deviceProperties": {
          "countryCode": "LU"
        },
        "deviceType": "machineSensor",
        "hwDeviceId": "860719022152999",
        "subscriptions": [],
        "tags": [      "ubirch#0",       "sensor"    ],
        "updated": "2016-04-29T13:48:46.405Z",
        "deviceLastUpdated": "2016-04-29T13:48:46.405Z",
        "avatarLastUpdated": "2016-04-29T13:48:46.405Z",
        "syncState" : "insync",
        "avatarState": {
          "desired": {
            "i": 1800,
            "bf": 1,
            "r": 13944,
            "g": 21696,
            "b": 17840
          },
          "reported": {
            "la": "52.502769",
            "lo": "13.477947",
            "ba": 13,
            "lp": 55,
            "e": 0,
            "i": 1800,
            "bf": 1,
            "r": 13944,
            "g": 21696,
            "b": 17840
          }
        }
      },
      {
        "created": "2016-04-29T13:48:46.403Z",
        "deviceConfig": {
          "i": 3600,
          "ir": 191,
          "s": 0
        },
        "deviceId": "0c5a19bf-194c-40ea-bf46-0416a176aedb",
        "deviceName": "trackleSensor_LU_8caa2520-d8f0-4c85-9705-4707054f4e11",
        "deviceProperties": {
          "countryCode": "LU"
        },
        "deviceType": "trackleSensor",
        "hwDeviceId": "860719022152999",
        "subscriptions": [],
        "tags": [      "ubirch#0",       "sensor"    ],
        "updated": "2016-04-29T13:48:46.405Z",
        "deviceLastUpdated": "2016-09-01T13:48:46.405Z",
        "avatarLastUpdated": "2016-09-01T13:48:46.405Z",
        "syncState" : "insync",
        "avatarState": {
          "desired": {
            "i": 1800,
            "bf": 1,
            "r": 13944,
            "g": 21696,
            "b": 17840
          },
          "reported": {
            "la": "52.502769",
            "lo": "13.477947",
            "ba": 13,
            "lp": 55,
            "e": 0,
            "i": 1800,
            "bf": 1,
            "r": 13944,
            "g": 21696,
            "b": 17840
          }
        }
      }
    ];

  var d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  $scope.today = d;

  $scope.fromToday = function(date){
    return new Date(date) >= $scope.today;
  };


    $scope.openDeviceDetails = function (deviceId) {
      $location.url( "device-details/" + deviceId);
    };

    $scope.createDevice = function() {
      $location.url( "device-crud");
    };


    $scope.getDeviceTypeIcon = function(deviceType){
      var iconStr;

      switch (deviceType) {
        case "lightsSensor":
          iconStr = "ion-ios-lightbulb";
          break;
        case "temperaturesSensor":
          iconStr = "ion-thermometer";
          break;
        case "noisesSensor":
          iconStr = "ion-mic-c";
          break;
        case "wetnessSensor":
          iconStr = "ion-waterdrop";
          break;
        default:
          iconStr = "ion-radio-waves";
      }
      return iconStr;
    };

  // TODO: change dummy and get real trustwothness state!!
    $scope.getDeviceTrustColor = function(device){
      var colorClassStr;
      switch (device.deviceType) {
        case "lightsSensor":
          colorClassStr = "green";
          break;
        case "temperaturesSensor":
          colorClassStr = "yellow";
          break;
        case "noisesSensor":
          colorClassStr = "red";
          break;
        case "wetnessSensor":
          colorClassStr = "yellow";
          break;
        default:
          colorClassStr = "grey";
      }
      return colorClassStr;
    };
  }]);
