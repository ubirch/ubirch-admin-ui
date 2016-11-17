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

app.controller('DevicesListCtrl', [ '$scope', '$location', 'Device', '$translate', '$window', '$document', '$timeout', '$filter', 'toaster', 'DeviceTypes', 'constant', 'deviceTypesList',
  function ($scope, $location, Device, $translate, $window, $document, $timeout, $filter, toaster, DeviceTypes, constant, deviceTypesList) {

    $scope.deviceTypes = deviceTypesList;

    function tick() {
      Device.getDevicesList(function (data) {
        $scope.devices = data;
 //       $timeout(tick, constant.POLLING_INTERVAL);
      });
    }

    tick();

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

    $scope.openNewDeviceDialog = function() {
      $scope.newDevice = {
        deviceTypeKey: constant.DEFAULT_DEVICE_TYPE_KEY
      };
      $scope.addedProperties = Device.initDevice();

      $scope.$watch( "newDevice.deviceTypeKey", function(newTypeKey) {
        var newType = $filter('getDeviceType')($scope.deviceTypes, newTypeKey);
        $scope.newDevice.deviceProperties = newType.defaults.properties;
        $scope.newDevice.tags = newType.defaults.tags;
        $scope.newDevice.deviceConfig = newType.defaults.config;
      });
      angular.element('#myModal').modal('show');
    };

    $scope.cancelCreateDevice = function() {
      toaster.pop('warning', "Abbruch", "Anlegen eines neuen Gerätes wurde abgebrochen");
    };

    $scope.createDevice = function() {
      angular.element('#myModal').modal('hide');

      $scope.newDevice = Device.addProperties($scope.newDevice,  $scope.addedProperties);
      $scope.addedProperties = Device.initDevice();

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
    $scope.match = function(key) {
      return function(collection) { return collection.key.match(key); };
    };
  }]);
