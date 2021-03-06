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

app.controller('DevicesListCtrl', [ '$scope', '$rootScope', '$location', 'Device', '$translate', '$window', '$document', '$timeout', '$filter', '$log', 'toaster', 'DeviceTypes', 'constants', 'settings', 'deviceTypesList',
  function ($scope, $rootScope, $location, Device, $translate, $window, $document, $timeout, $filter, $log, toaster, DeviceTypes, constants, settings, deviceTypesList) {

    $scope.deviceTypes = deviceTypesList;

    var listPromise;

    (function refreshData() {
      // Assign to scope within callback to avoid data flickering on screen
      Device.getDevicesList(function (data) {
        $scope.devices = data;
        listPromise = $timeout(refreshData, constants.POLLING_INTERVAL);
      },
        function (error) {
          $log.warn("On loading device list an error uccurred: "+error);
          listPromise = $timeout(refreshData, constants.POLLING_INTERVAL);
        }
      );
    })();

    $scope.$on('$destroy', function(){
      $timeout.cancel(listPromise);
    });

    $scope.$on('auth:signedOut', function () {
      $timeout.cancel(listPromise);
    });

    $scope.fromToday = function(date){
      return new Date(date) >= constants.TODAY;
    };

    $scope.openDeviceDetails = function (deviceId) {
      $location.url( "device-details/" + deviceId);
    };

    $scope.openNewDeviceDialog = function() {
      $scope.newDevice = {
        deviceTypeKey: settings.DEFAULT_DEVICE_TYPE_KEY ? settings.DEFAULT_DEVICE_TYPE_KEY : constants.DEFAULT_DEVICE_TYPE_KEY
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
      $rootScope.closeModal('#myModal');

      $scope.newDevice = Device.addProperties($scope.newDevice,  $scope.addedProperties);
      $scope.addedProperties = Device.initDevice();

      Device.createDevice(
        $scope.newDevice,
        function(data){
          $location.url( "device-details/" + data.deviceId);
        },
        function(error) {
          if (error.data && error.data.errorMessage)
          toaster.pop('error',
            error.data && error.data.errorType ? error.data.errorType : "Fehler",
            error.data && error.data.errorMessage ? error.data.errorMessage : "Es konnte kein neues Gerät angelegt werden!!");
        }
      );
    };
    $scope.match = function(key) {
      return function(collection) { return collection.key.match(key); };
    };
  }]);
