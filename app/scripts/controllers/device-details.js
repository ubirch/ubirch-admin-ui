'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DeviceDetailsCtrl
 * @description
 * # DeviceDetailsCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DeviceDetailsCtrl',[ '$scope', '$window', '$location', '$stateParams', 'Device', 'toaster',
    function ($scope, $window, $location, $stateParams, Device, toaster) {
    var listUrl = "devices-list";

    $scope.activeTab = "state";
    $scope.device = {};
    $scope.deviceState =  [];
    var deviceStateSaved =  [];
    $scope.stateDataChanged = false;
    $scope.stateKats = [];
//    var numOfMessages = 10;


    if ($stateParams.deviceid) {
      $scope.device = Device.getDevice($stateParams.deviceid);
      Device.getDeviceState($stateParams.deviceid,
        function(data){

          var collector = {};

          angular.forEach( data, function(katObj, kat){
            // don't add $promise, $resolved aso
            if (!kat.startsWith("$")){
              switch(kat) {
                case "avatarLastUpdated":
                  $scope.avatarLastUpdated = katObj;
                  break;
                case "deviceLastUpdated":
                  $scope.deviceLastUpdated = katObj;
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

      $scope.messages = Device.getHistory($stateParams.deviceid /*, numOfMessages */);

    }

      /**
       * edit and save device state items
       */

    $scope.checkDeviceStateChanges = function() {
      $scope.stateDataChanged = true;
    };

    $scope.discardDeviceStateChanges = function(){
      $scope.deviceState = angular.copy(deviceStateSaved);
      $scope.stateDataChanged = false;
    };

    $scope.saveDeviceStateChanges = function(){
      deviceStateSaved = angular.copy($scope.deviceState);
      $scope.stateDataChanged = false;
      // TODO: send data to server
      $window.bootbox.alert("Sorry, to change the state of a device is not yet implemented!");
    };

      /**
       * device CRUD
       */
      $scope.added = Device.initDevice();


      $scope.updateDevice = function () {

        $scope.device = Device.addProperties($scope.device,  $scope.added);
        $scope.added = Device.initDevice();

        Device.updateDevice(
          $scope.device,
          function(){
            toaster.pop('success', "Änderungen gespeichert", "Änderungen am Gerät wurden gespeichert");
            $location.url( "device-details/"+$scope.device.deviceId);
          },
          function() {
            toaster.pop('error', "Fehler", "Gerät konnte nicht gelöscht werden!!");
          }
        );
      };


      $scope.deleteDevice = function () {
      angular.element('#myModal').modal('hide');
      Device.deleteDevice($scope.device.deviceId,
        function(){
          $location.url( "devices-list");
        },
        function() {
          toaster.pop('error', "Fehler", "Gerät konnte nicht gelöscht werden!!");
        }
      );
    };

    $scope.backToList = function () {
      $location.url(listUrl);
    };

    $scope.selectType = function(type){

      $scope.device.deviceTypeKey = type;
    };
  }]);
