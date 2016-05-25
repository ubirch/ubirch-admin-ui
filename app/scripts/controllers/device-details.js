'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DeviceDetailsCtrl
 * @description
 * # DeviceDetailsCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DeviceDetailsCtrl',[ '$scope', '$window', '$location', '$routeParams', function ($scope, $window, $location, $routeParams) {
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

    if ($routeParams.deviceid) {
      $scope.device = deviceMock;

      var collector = {};

      angular.forEach(deviceMock.avatarState, function(katObj, kat){
        var kategory = kat;
        angular.forEach(katObj, function(value, key){
          if (!collector[key])
            collector[key] = {};
          collector[key][kategory] = value;
          collector[key].type = key;
        })
      });

      angular.forEach(collector, function (value) {
        $scope.deviceState.push(value);
      });
    }

    $scope.removeDevice = function (device) {

      var deviceStr = "Are you sure to delete device " + device.deviceName + "?";

      $window.bootbox.confirm(deviceStr, function (doit) {
        if (doit) {
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

    $scope.getDeviceTypeIcon = function(deviceType){
      var iconStr;

      switch (deviceType) {
        case "lightsSensor":
          iconStr = "glyphicon glyphicon-lamp";
          break;
        case "temperaturesSensor":
          iconStr = "glyphicon glyphicon-fire";
          break;
        default:
          iconStr = "glyphicon glyphicon-retweet";
      }
      return iconStr;
    };

  }]);
