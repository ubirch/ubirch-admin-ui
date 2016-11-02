'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DeviceDetailsCtrl
 * @description
 * # DeviceDetailsCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DeviceDetailsCtrl',[ '$scope', '$window', '$location', '$stateParams', 'Device', function ($scope, $window, $location, $stateParams, Device) {
    var listUrl = "devices-list";

    $scope.activeTab = "state";
    $scope.device = {};
    $scope.deviceState =  [];
    var deviceStateSaved =  [];
    $scope.stateDataChanged = false;
    $scope.stateKats = [];
    var numOfMessages = 10;


    if ($stateParams.deviceid) {
      $scope.device = Device.getDevice($stateParams.deviceid);
      Device.getDeviceState($stateParams.deviceid,
        function(data){

          var collector = {};

          angular.forEach( data, function(katObj, kat){
            // don't add $promise, $resolved aso
            if (!kat.startsWith("$")){
              switch(kat) {
                case "avatarLastUpdate":
                  $scope.avatarLastUpdate = katObj;
                  break;
                case "deviceLastUpdate":
                  $scope.deviceLastUpdate = katObj;
                  break;
                case "syncState":
                  $scope.syncState = katObj;
                  break;
                default:
                  var kategory = kat;
                  // save the parameter name for row identification
                  $scope.stateKats.push(kategory);

                  angular.forEach(katObj, function(value, key){
                    if (!collector[key]){
                      collector[key] = {"stateKey": key};
                    }
                    collector[key][kategory] = value;
                  });
              }
            }
          });
          $scope.deviceState = collector;

          deviceStateSaved = angular.copy($scope.deviceState);
        }
      );

      /**
       * For history of device data (test-data-set: deviceId = "d65f1582-5cd2-4f8c-8607-922ecc2b4b45")
       */

      $scope.messages = Device.getHistory($stateParams.deviceid, numOfMessages);

    }

    $scope.checkChanges = function() {
      $scope.stateDataChanged = true;
    };

    $scope.discardChanges = function(){
      $scope.deviceState = angular.copy(deviceStateSaved);
      $scope.stateDataChanged = false;
    };

    $scope.saveChanges = function(){
      deviceStateSaved = angular.copy($scope.deviceState);
      $scope.stateDataChanged = false;
      // TODO: send data to server
    };

    $scope.removeDevice = function (device) {

      var deviceStr = "Are you sure to delete device " + device.deviceName + "?";

      $window.bootbox.confirm(deviceStr, function (doit) {
        if (doit) {
          // TODO: send data to server
        }
      });
    };

    $scope.save = function (){
      $location.url(listUrl);
    };

    $scope.create = function (){
      $location.url(listUrl);
    };

    $scope.backToList = function () {
      $location.url(listUrl);
    };

    $scope.selectType = function(type){

      $scope.device.deviceTypeKey = type;
    };
  }]);
