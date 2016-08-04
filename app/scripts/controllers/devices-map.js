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
      defaults: {
        scrollWheelZoom: false
      }
    });
  }]);
