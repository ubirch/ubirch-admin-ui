'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DeviceDetailsCtrl
 * @description
 * # DeviceDetailsCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DeviceDetailsCtrl',[ '$scope', '$window', '$location', '$stateParams', '$filter', 'Device', 'constant', 'toaster', 'deviceTypesList', 'DeviceTypes', 'leafletBoundsHelpers',
    function ($scope, $window, $location, $stateParams, $filter, Device, constant, toaster, deviceTypesList, DeviceTypes, leafletBoundsHelpers) {
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
        center: {},
        markers: {},
        bounds: {},
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

      function calculateMapExtract(markers) {
        var markerKeys = Object.keys(markers);
        if (markerKeys.length) {

          markerKeys.forEach(function(key) {

            var marker = markers[key];
            // TODO: calculate bounds from marker positions

          });

          var bounds = leafletBoundsHelpers.createBoundsFromArray([
            [ 51.508742458803326, -0.087890625 ],
            [ 51.508742458803326, -0.087890625 ]
          ]);
          $scope.leafletValues.bounds = {};
          $scope.leafletValues.center = {
            zoom: 15,
            lat: markers['marker0'].lat,
            lng: markers['marker0'].lng
          };
        }
        else {
          $scope.leafletValues.bounds = {};
        }
      }
      function calculateMap() {

        var markers = {};

        if ($scope.messages.content) {

          $scope.messages.content.forEach(function (message, i) {

            if (message.deviceMessage.latitude && message.deviceMessage.longitude ){
              var marker = {
                focus: false,
                draggable: true,
                lat: message.deviceMessage.latitude,
                lng: message.deviceMessage.longitude,
                message: filterMessageKeys(message),
                opacity: 1 / $scope.messages.content.length * (i + 1)
              };

              markers["marker" + i] = angular.copy(marker);
            }
          });
        }

        $scope.leafletValues.markers = markers;

        calculateMapExtract(markers);

      }

      function addParamToMessage (message, label, key) {
        if (label.length > 0){
          label += ", ";
        }
        label += key + ": " + message.deviceMessage[key];
        return label;
      }

      /**
       * construct
       * "Temperature Sensor<br><strong>18,5°C</strong><br>2017-02-24, 9:41:25"
       * @param message
       * @returns {*}
       */
      function filterMessageKeys(message) {

        var deviceTypes = DeviceTypes.getDeviceTypeList();
        var deviceType = $filter('getDeviceType')(deviceTypes, message.deviceType);
        var timestamp = new Date(message.timestamp).getTime();

        var paramStr = "";

        Object.keys(message.deviceMessage).forEach(function (key) {

          // if displayKeys are defined for this deviceType filter these keys from message properties
          if (deviceType && deviceType.displayKeys && deviceType.displayKeys.length > 0) {
            if (deviceType.displayKeys.indexOf(key) !== -1) {
              paramStr = addParamToMessage(message, paramStr, key);
            }
          }
          // if no displayKeys are defined for this deviceType display all message properties
          else if (key != "latitude" && key != "longitude" ){
            paramStr = addParamToMessage(message, paramStr, key);
          }

        });

        var label = deviceType.name.en;
        label += "<br><strong>";
        label += paramStr;
        label += "</strong>";
        label += "<br>" + $filter('date')(timestamp, 'yyyy-MM-dd, H:mm:ss');

        return label;
      }

    }]);
