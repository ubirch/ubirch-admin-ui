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

app.controller('DevicesListCtrl', [ '$scope', '$location', 'Device', function ($scope, $location, Device) {

  $scope.devices = Device.getDevicesList();

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

  }]);
