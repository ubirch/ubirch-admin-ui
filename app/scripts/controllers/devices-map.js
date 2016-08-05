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


    angular.extend($scope, {
      center: {
        lat: 52.50466320614026,
        lng: 13.480031490325928,
        zoom: 12
      },
      markers: {
        temperatureMarker: {
          lat: 52.50466320614026,
          lng: 13.480031490325928,
          message: "Temperature Sensor<br><strong>18,5°C</strong><br><a href='http://admin.ubirch.com/#/device-details/0c5a19bf-194c-40ea-bf46-0416a176aedb'><br>open sensor data</a>!",
          focus: true,
          draggable: false,
          icon: {
            type: 'awesomeMarker',
            prefix: 'ion',
            icon: 'thermometer',
            markerColor: 'red'
          }
        },
        colorMarker: {
          lat: 52.48583796201143,
          lng: 13.490266799926758,
          message: "Color Sensor<br><strong>r:1087, g:854, b:219</strong><br><a href='http://admin.ubirch.com/#/device-details/0c5a19bf-194c-40ea-bf46-0416a176aedb'><br>open sensor data</a>!",
          draggable: false,
          icon: {
            type: 'awesomeMarker',
            prefix: 'ion',
            icon: 'android-color-palette',
            markerColor: 'green'
          }
        },
        waterMarker: {
          lat: 52.48591636280468,
          lng: 13.48073959350586,
          message: "Water Sensor<br><strong>34,6%</strong><br><a href='http://admin.ubirch.com/#/device-details/0c5a19bf-194c-40ea-bf46-0416a176aedb'><br>open sensor data</a>!",
          draggable: false,
          icon: {
            type: 'awesomeMarker',
            prefix: 'ion',
            icon: 'waterdrop',
            markerColor: 'blue'
          }
        }
      },
      defaults: {
        scrollWheelZoom: false
      }
    });
  }]);
