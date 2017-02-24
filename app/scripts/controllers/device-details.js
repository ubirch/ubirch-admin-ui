'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DeviceDetailsCtrl
 * @description
 * # DeviceDetailsCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DeviceDetailsCtrl',[ '$scope', '$window', '$location', '$stateParams', '$filter', 'Device', 'constant', 'toaster', 'deviceTypesList', 'DeviceTypes',
    function ($scope, $window, $location, $stateParams, $filter, Device, constant, toaster, deviceTypesList, DeviceTypes) {
    var listUrl = "devices-list";

      $scope.deviceid = $stateParams.deviceid;
      $scope.device = {};
      $scope.deviceState =  [];
      var deviceStateSaved =  [];
      $scope.stateDataChanged = false;
      $scope.stateKats = [];
      $scope.messages = {
        content: undefined
      };
      $scope.activeTab = "state";
      $scope.activeVisualTab = "chart";
      $scope.leafletValues = {
        center: { zoom: 12 },
        markers: {},
        defaults: { scrollWheelZoom: false }
      };


      if ($stateParams.deviceid) {
        $scope.device = Device.getDevice($stateParams.deviceid, function(deviceVal){
          $scope.deviceType = $filter('getDeviceType')(deviceTypesList, deviceVal.deviceTypeKey);
        });

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
                  case "inSync":
                    $scope.inSync = katObj;
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
      /**
       * calculate map markers when new messages loaded
       */
      $scope.$watch('messages.content', function() {
        calculateMap();
      });

      function calculateMap() {

        if ($scope.messages.content) {

          var markers = {};

          $scope.messages.content.forEach(function (message, i) {

            var label = message.deviceType;
            // message: "Temperature Sensor<br><strong>18,5°C</strong><br><a href='http://admin.ubirch.com/#/device-details/0c5a19bf-194c-40ea-bf46-0416a176aedb'><br>open sensor data</a>!",
            label += "<br><strong>";
            switch (message.deviceType) {
              case "envSensor":
                label += "humidity:" + message.deviceMessage.humidity + ", presure:" + message.deviceMessage.presure + ", temperature:" + message.deviceMessage.temperature;
                break;
              default:
                label += "...";
            }
            label += "</strong>";
            label += "<br>" + message.timestamp;

            var marker = {
              focus: false,
              draggable: true,
              lat: message.deviceMessage.latitude,
              lng: message.deviceMessage.longitude,
              message: label,
              opacity: 1 / $scope.messages.content.length * (i + 1)
            };

            markers["marker" + i] = angular.copy(marker);
          });

          $scope.leafletValues.markers = markers;

          if ($scope.messages.content.length > 0) {
            $scope.leafletValues.center.lat = markers['marker0'].lat;
            $scope.leafletValues.center.lng = markers['marker0'].lng;
          }
        }
      }

    }]);
