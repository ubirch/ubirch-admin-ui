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

app.controller('DevicesListCtrl', [ '$scope', '$location', 'Device', '$translate', '$window', '$document', 'toaster', 'DeviceTypes',
  function ($scope, $location, Device, $translate, $window, $document, toaster, DeviceTypes) {

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

    $scope.cancelCreateDevice = function() {
      toaster.pop('warning', "Abbruch", "Anlegen eines neuen Gerätes wurde abgebrochen");
    };

    $scope.newDevice = {
      hwDeviceId: undefined,
      deviceTypeKey: DeviceTypes.getDefaultType().key
    };

    $scope.$watch( "newDevice.deviceTypeKey", function(newTypeKey) {
      var newType = DeviceTypes.getDeviceType(newTypeKey);
      $scope.newDevice.deviceProperties = newType.defaults.properties;
      $scope.newDevice.tags = newType.defaults.tags;
      $scope.newDevice.deviceConfig = newType.defaults.config;
    });
    $scope.createDevice = function() {
      angular.element('#myModal').modal('hide');
      Device.createDevice(
        $scope.newDevice,
        function(data){
          $location.url( "device-details/" + data.deviceId);
        },
        function() {
          toaster.pop('error', "Fehler", "Es konnte kein neues Gerät angelegt werden!!");
        }
      );
    };
  }]);
