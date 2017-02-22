'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DeviceDetailsCtrl
 * @description
 * # DeviceDetailsCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DeviceDetailsCtrl',[ '$scope', '$window', '$location', '$stateParams', '$filter', 'Device', 'constant', 'toaster', 'deviceTypesList',
    function ($scope, $window, $location, $stateParams, $filter, Device, constant, toaster, deviceTypesList) {
    var listUrl = "devices-list";

      $scope.activeTab = "state";
      $scope.activeFilterTab = "filterbydate";
      $scope.todayReached = true;
      $scope.device = {};
      $scope.deviceState =  [];
      var deviceStateSaved =  [];
      $scope.stateDataChanged = false;
      $scope.stateKats = [];
      $scope.values = {};
      $scope.values.numOfMessages = 10;
      $scope.values.startDate = new Date();
      $scope.values.endDate = undefined;
      $scope.startIndex = 0;
      $scope.endOfDataReached = false;
      $scope.messages = undefined;

      angular.extend($scope, {
        center: {
          lat: 52.50466320614026,
          lng: 13.480031490325928,
          zoom: 12
        },
        markers: {},
        defaults: {
          scrollWheelZoom: false
        }
      });

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

        loadHistory();
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

      $scope.numOfMessagesChanged = function() {
        loadHistory();
      };

      $scope.page_next = function() {
        $scope.startIndex += $scope.values.numOfMessages;
        loadHistory();
      };

      $scope.page_prev = function() {
        $scope.startIndex = $scope.startIndex >= $scope.values.numOfMessages ? $scope.startIndex - $scope.values.numOfMessages : 0;
        loadHistory();
      };

    function loadHistory(){
      Device.getDefinedHistory($stateParams.deviceid, $scope.startIndex, $scope.values.numOfMessages,
        function(data){
          if (data.length > 0){
            $scope.messages = data;
            $scope.endOfDataReached = false;
            calculateMap();
          }
          else {
            disableNextButton();
          }
        },
        function(){
          disableNextButton();
        });
    }
      $scope.next_date = function() {
        var nextday = new Date();
        nextday.setDate($scope.values.startDate.getDate()+1);

        $scope.values.startDate = nextday;

        if (nextday > constant.TODAY){
          $scope.todayReached = true;
        }

        loadHistory();


      };

      $scope.prev_date = function() {
        var prevday = new Date();
        prevday.setDate($scope.values.startDate.getDate()-1);

        $scope.values.startDate = prevday;
        loadHistory();
        $scope.todayReached = false;
      };

      $scope.load_history = function() {
        loadHistory();
      };

      function loadHistory(){

        if ($scope.activeFilterTab === "filterbydate"){
          // TODO: get history by date
          Device.getHistoryOfDateRange($stateParams.deviceid, $scope.values.startDate, $scope.values.endDate,
            function(data){
              if (data.length > 0){
                $scope.messages = data;
                $scope.endOfDataReached = false;
              }
              else {
                $scope.messages = [];
              }
            },
            function(){
              $scope.messages = [];
            });
        }
        else {
          Device.getHistoryOfRange($stateParams.deviceid, $scope.startIndex, $scope.values.numOfMessages,
            function(data){
              if (data.length > 0){
                $scope.messages = data;
                $scope.endOfDataReached = false;
              }
              else {
                disableNextButton();
              }
            },
            function(){
              disableNextButton();
            });
        }
      }

    function disableNextButton() {
      $scope.startIndex = $scope.startIndex >= $scope.values.numOfMessages ? $scope.startIndex - $scope.values.numOfMessages : 0;
      $scope.endOfDataReached = true;
    }

    function calculateMap() {
      angular.forEach($scope.messages, function(message) {
        console.log(message);
      });
    }
  }]);
