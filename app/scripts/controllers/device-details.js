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
    var deviceMock = {
      "created": "2016-04-29T13:48:46.403Z",
      "deviceConfig": {
        "i": 3600,
        "ir": 191,
        "s": 0
      },
      "deviceId": "0c5a19bf-194c-40ea-bf46-0416a176aedb",
      "deviceName": "lightsSensor_LU_8caa2520-d8f0-4c85-9705-4707054f4e11",
      "deviceProperties": {
        "countryCode": "LU"
      },
      "deviceType": "lightsSensor",
      "hwDeviceId": "860719022152999",
      "subscriptions": [],
      "tags": [      "ubirch#0",       "sensor"    ],
      "updated": "2016-04-29T13:48:46.405Z",
      "deviceLastUpdated": "2016-04-29T13:48:46.405Z",
      "avatarLastUpdated": "2016-04-29T13:48:46.405Z",
      "syncState" : "insync",
      "avatarState": {
        "desired": {
          "i": 1800,
          "bf": 1,
          "r": 13944,
          "g": 21696,
          "b": 17840
        },
        "reported": {
          "la": "52.502769",
          "lo": "13.477947",
          "ba": 13,
          "lp": 55,
          "e": 0,
          "i": 1800,
          "bf": 1,
          "r": 13944,
          "g": 21696,
          "b": 17840
        }
      }
    };

    //[
    //  {"type": "i",
    //    "desired": 1800,
    //    "reported": 1800
    //  }
    //]
    //
    $scope.activeTab = "state";
    $scope.device = {};
    $scope.deviceState =  [];
    var deviceStateSaved =  [];
    $scope.stateDataChanged = false;
    $scope.stateKats = [];


    if ($stateParams.deviceid) {
      $scope.device = deviceMock;

      var collector = {};

      angular.forEach(deviceMock.avatarState, function(katObj, kat){

        var kategory = kat;
        // save the parameter name for row identification
        $scope.stateKats.push(kategory);

        angular.forEach(katObj, function(value, key){
          if (!collector[key]){
            collector[key] = {"stateKey": key};
          }
          collector[key][kategory] = value;
        });
      });

      $scope.deviceState = collector;

      deviceStateSaved = angular.copy($scope.deviceState);
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

      $scope.device.deviceType = type;
    };

    /**
       * For history of device data
     */

    // TODO: get Testdata from $scope
      var deviceId = "d65f1582-5cd2-4f8c-8607-922ecc2b4b45";
      var numOfMessages = 10;

      $scope.messages = Device.getHistory(deviceId, numOfMessages);
  }]);
