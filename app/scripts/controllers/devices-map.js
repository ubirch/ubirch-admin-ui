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
        ferzensMarker: {
          lat: 52.50466320614026,
          lng: 13.480031490325928,
          message: "Ferzens live here!<a href='http://www.google.de'><br>google</a>!",
          focus: true,
          draggable: false
        },
        testMarker: {
          lat: 52.48583796201143,
          lng: 13.490266799926758,
          message: "Testmarker",
          draggable: false
        }
      },
      defaults: {
        scrollWheelZoom: false
      }
    });
  }]);
