'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DevicesMapCtrl
 * @description
 * # DevicesMapCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DevicesMapCtrl', [ '$scope', function($scope) {
    var appPath = "http://admin.ubirch.com/#/device-details/";

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
            "la": "52.50466320614026",
            "lo": "13.480031490325928",
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
        "deviceName": "temperatureSensor_LU_8caa2520-d8f0-4c85-9705-4707054f4e11",
        "deviceProperties": {
          "countryCode": "LU"
        },
        "deviceType": "temperatureSensor",
        "hwDeviceId": "221529998607190",
        "subscriptions": [],
        "tags": [      "ubirch#1",       "sensor"    ],
        "updated": "2016-04-29T13:48:46.405Z",
        "deviceLastUpdated": "2016-04-29T13:48:46.405Z",
        "avatarLastUpdated": "2016-04-29T13:48:46.405Z",
        "syncState" : "insync",
        "avatarState": {
          "desired": {
            "i": 1800,
            "bf": 1,
            "t": 18.9
          },
          "reported": {
            "la": "52.48583796201143",
            "lo": "13.490266799926758",
            "ba": 13,
            "lp": 55,
            "e": 0,
            "i": 1800,
            "bf": 1,
            "t": 18.9
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
        "deviceName": "waterSensor_LU_8caa2520-d8f0-4c85-9705-4707054f4e11",
        "deviceProperties": {
          "countryCode": "LU"
        },
        "deviceType": "waterSensor",
        "hwDeviceId": "860719022152999",
        "subscriptions": [],
        "tags": ["ubirch#2", "sensor"],
        "updated": "2016-04-29T13:48:46.405Z",
        "deviceLastUpdated": "2016-04-29T13:48:46.405Z",
        "avatarLastUpdated": "2016-04-29T13:48:46.405Z",
        "syncState": "insync",
        "avatarState": {
          "desired": {
            "i": 1800,
            "bf": 1,
            "w": 34.9
          },
          "reported": {
            "la": "52.48591636280468",
            "lo": "13.48073959350586",
            "ba": 13,
            "lp": 55,
            "e": 0,
            "i": 1800,
            "bf": 1,
            "w": 34.9
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
        "deviceName": "waterSensor_LU_8caa2520-d8f0-4c85-9705-4707054f4e11",
        "deviceProperties": {
          "countryCode": "LU"
        },
        "deviceType": "pressureSensor",
        "hwDeviceId": "860719022152999",
        "subscriptions": [],
        "tags": [      "ubirch#3",       "sensor"    ],
        "updated": "2016-04-29T13:48:46.405Z",
        "deviceLastUpdated": "2016-04-29T13:48:46.405Z",
        "avatarLastUpdated": "2016-04-29T13:48:46.405Z",
        "syncState" : "insync",
        "avatarState": {
          "desired": {
            "i": 1800,
            "bf": 1,
            "w": 34.9
          },
          "reported": {
            "la": "52.50180270642149",
            "lo": "13.527688980102539",
            "ba": 13,
            "lp": 55,
            "e": 0,
            "i": 1800,
            "bf": 1,
            "p": 85.3
          }
        }
      }
    ];
    angular.extend($scope, {
      center: {
        lat: 52.50466320614026,
        lng: 13.480031490325928,
        zoom: 12
      },
      markers: {},
      defaults: {
        scrollWheelZoom: false
      }
    });

    var icons = {
      default: {
        type: 'awesomeMarker',
        prefix: 'ion',
        icon: 'android-wifi',
        markerColor: 'gray'
      },
      temperatureSensor: {
        type: 'awesomeMarker',
        prefix: 'ion',
        icon: 'thermometer',
        markerColor: 'red'
      },
      lightsSensor: {
        type: 'awesomeMarker',
          prefix: 'ion',
          icon: 'ios-lightbulb',
          markerColor: 'green'
      },
      waterSensor: {
        type: 'awesomeMarker',
          prefix: 'ion',
          icon: 'waterdrop',
          markerColor: 'blue'
      }
    };

    for (var i=0; i<$scope.devices.length; i++){

      var device = $scope.devices[i];

      var message = device.deviceType;
      // message: "Temperature Sensor<br><strong>18,5°C</strong><br><a href='http://admin.ubirch.com/#/device-details/0c5a19bf-194c-40ea-bf46-0416a176aedb'><br>open sensor data</a>!",
      message += "<br><strong>";
      switch(device.deviceType){
        case "lightsSensor":
          message += "r:" + device.avatarState.reported.r + ", g:" + device.avatarState.reported.g + ", b:" + device.avatarState.reported.b;
          break;
        case "temperatureSensor":
          message += device.avatarState.reported.t + "°C";
          break;
        case "waterSensor":
          message += device.avatarState.reported.w + "%";
          break;
        default:
          message += "...";
      }
      message += "</strong>";
      message += "<br><a href='";
      message += appPath + device.deviceId;
      message += "'><br>open sensor data</a>!";

      var marker = {
        focus: true,
        draggable: false,
        lat: parseFloat(device.avatarState.reported.la),
        lng: parseFloat(device.avatarState.reported.lo),
        icon: icons[device.deviceType] !== undefined ? icons[device.deviceType] : icons.default,
        message: message
      };

      $scope.markers["marker"+i] = marker;
    }

  }]);
