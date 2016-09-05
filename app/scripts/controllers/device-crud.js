'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DeviceCrudCtrl
 * @description
 * # DeviceCrudCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DeviceCrudCtrl', [ '$scope', '$window', '$location', '$stateParams', function ($scope, $window, $location, $stateParams) {
    var listUrl = "devices-list";
    $scope.deviceTypes = [
      "lightsSensor",
      "temperaturesSensor",
      "Sensor",
      "Actor"
    ];
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

    $scope.device = {};

    if ($stateParams.deviceid) {
      $scope.device = deviceMock;
    }


    $scope.removeDevice = function (device) {

      var deviceStr = "Are you sure to delete device " + device.deviceName + "?";

      $window.bootbox.confirm(deviceStr, function (doit) {
        if (doit) {
          // TODO: delete
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


  }]);
