'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DevicesMapCtrl
 * @description
 * # DevicesMapCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DevicesMapCtrl', [ '$scope', 'Device', function($scope, Device) {
    var appPath = "http://admin.ubirch.com/#/device-details/";

    $scope.devices = Device.getDevicesList(
      function(){
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
      }
    );

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

  }]);
