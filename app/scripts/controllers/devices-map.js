'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DevicesMapCtrl
 * @description
 * # DevicesMapCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DevicesMapCtrl', [ '$scope', 'Device', 'deviceTypesList', 'constants', '$timeout',
    function($scope, Device, deviceTypesList, constants, $timeout) {


    $scope.deviceTypes = deviceTypesList;

    (function refreshData() {
      // Assign to scope within callback to avoid data flickering on screen
      Device.getDevicesList(function (data) {
          $scope.devices = data;
        }
      );
    })();

    $scope.selected = {
      devices: {},
      size: 0
    };

    $scope.switchDeviceSelection = function(device){
      if ($scope.selected.devices[device.deviceId] === undefined){
        device.messages = loadHistory4Device(device.deviceId);
        $scope.selected.devices[device.deviceId] = device;

        $scope.selected.size += 1;
      }
      else {
        delete $scope.selected.devices[device.deviceId];
        $scope.selected.size -= 1;
      }
      return $scope.selected.devices[device.deviceId] !== undefined;
    };

    $scope.isSelected = function(id) {
      return $scope.selected.devices[id] !== undefined;
    };

    $scope.match = function(key) {
      return function(collection) { return collection.key.match(key); };
    };

    // polling device history

    var messagesPromise;

   $scope.$on('$destroy', function(){
      if (messagesPromise !== undefined){
        $timeout.cancel(messagesPromise);
      }
    });
      $scope.$on('auth:signedOut', function () {
      if (messagesPromise !== undefined){
        $timeout.cancel(messagesPromise);
      }
    });

      /**
       * return promise with history messages
       * @param device
       */
    function loadHistory4Device(deviceId){

      return Device.getHistoryOfRange(deviceId, 0, 10,
        function(data){
          if (data.length > 0){
            return data;
          }
          else {
            return [];
          }
        },
        function(){
          return [];
        });
    }

    function reloadAllHistories() {
      var ids = Object.keys($scope.selected.devices);
      if ( ids.length > 0){
        // at least one device added
        // TODO: load history for every selected device
        // TODO: wait for all promises to resolve
        // TODO: polling with $timeout
//          messagesPromise = $timeout(loadHistory, constants.POLLING_INTERVAL);
      }
    }

  }]);
