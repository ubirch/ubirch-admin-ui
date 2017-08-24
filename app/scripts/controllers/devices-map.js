'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DevicesMapCtrl
 * @description
 * # DevicesMapCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DevicesMapCtrl', [ '$scope', 'Device', 'deviceTypesList', function($scope, Device, deviceTypesList) {


    $scope.deviceTypes = deviceTypesList;

    (function refreshData() {
      // Assign to scope within callback to avoid data flickering on screen
      Device.getDevicesList(function (data) {
          $scope.devices = data;
        }
      );
    })();

    var selectedDevices = {};

    $scope.switchDeviceSelection = function(id){
      if (selectedDevices[id] === undefined){
        selectedDevices[id] = false;
      }
      selectedDevices[id] = !selectedDevices[id];
    };

    $scope.selected = function(id) {
      return selectedDevices[id] !== undefined && selectedDevices[id];
    };

    $scope.match = function(key) {
      return function(collection) { return collection.key.match(key); };
    };

  }]);
