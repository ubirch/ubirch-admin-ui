'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:DeviceDetailsCtrl
 * @description
 * # DeviceDetailsCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('DeviceDetailsCtrl',[ '$scope', '$rootScope', '$window', '$location', "$sessionStorage", "constants", "settings",
    '$stateParams', '$filter', '$timeout', 'Device', 'toaster', 'deviceTypesList', 'DeviceTypes', 'NACL', 'leafletBoundsHelpers',
    function ($scope, $rootScope, $window, $location, $sessionStorage, constants, settings,
              $stateParams, $filter, $timeout, Device, toaster, deviceTypesList, DeviceTypes, NACL, leafletBoundsHelpers) {
    var listUrl = "devices-list";

      $scope.deviceid = $stateParams.deviceid;
      $scope.activeTab = "state";
      $scope.showKeyTab = false;
      $scope.device = {};
      $scope.loadDeviceState = true;
      $scope.deviceState =  [];
      var deviceStateSaved =  [];
      $scope.stateDataChanged = false;
      $scope.stateKats = [];
      $scope.values = {};
      $scope.values.numOfMessages = 10;
      $scope.startIndex = 0;
      $scope.endOfDataReached = false;

      $scope.messages = {
        content: undefined
      };
      $scope.activeTab = {
        main: "history",
        visual: "chart",
        filter: "filterbydate"
      };
      $scope.filterValues = {
        startIndex: 0,
        numOfMessages: 10,
        startDate: undefined,
        endDate: undefined,
        ignoreTime: false,
        autoreload: false
      };
      $scope.shownSeries = {};
      $scope.seperationParams = {
        yaxes: "all"  // "all" or "single"
      };

      $scope.leafletValues = {
        center: {},
        markers: {},
        bounds: {},
        defaults: { scrollWheelZoom: false }
      };
      $scope.markersDefined = false;

      $scope.devInfo = {
        mqtt: {},
        query: {}
      };

      $scope.getKeysList = function (hwDeviceId) {
        NACL.getCurrentKeysOf(
          hwDeviceId,
          function (data) {
            $scope.publicKeys = data;
          },
          $rootScope.showError
        );
      };

      if ($stateParams.deviceid) {

        Device.getDevice($stateParams.deviceid, function(deviceVal){
            $scope.device = deviceVal;
            $scope.deviceType = $filter('getDeviceType')(deviceTypesList, deviceVal.deviceTypeKey);
            $scope.showKeyTab = settings.KEY_GENERATION_FOR_DEVICE_TYPES !== undefined && settings.KEY_GENERATION_FOR_DEVICE_TYPES.indexOf($scope.deviceType.key) >= 0;
            if ($scope.showKeyTab){
//              $scope.getKeysList($scope.device.hwDeviceId);
            }
            $scope.devInfo.query = {
              docuUrl: constants.AVATAR_SERVICE_DOCUMENTATION,
              example: {
                deviceId: $scope.device.deviceId,
                token: $sessionStorage.token.token,
                host: settings.UBIRCH_API_HOST,
                curl: "curl -XGET -H 'Authorization: Bearer $TOKEN' $HOST/api/avatarService/v1/device/$DEVICEID/data/history/0/10"
              }
            };
            if (settings.MQTT_SERVER !== undefined){
              $scope.devInfo.mqtt.host = settings.MQTT_SERVER.HOST;
              if (settings.MQTT_SERVER.PORT !== undefined) {
                $scope.devInfo.mqtt.port = settings.MQTT_SERVER.PORT;
              }
              $scope.devInfo.mqtt.serverUrl = settings.MQTT_SERVER.HOST + (settings.MQTT_SERVER.PORT !== undefined ? ":" + settings.MQTT_SERVER.PORT : "");
              $scope.devInfo.mqtt.curl = 'mosquitto_sub -h ' + $scope.devInfo.mqtt.host + (($scope.devInfo.mqtt.port !== undefined) ? ' -p ' + $scope.devInfo.mqtt.port : '') + ' -t "' + settings.ENV_ID + '/ubirch/devices/$DEVICEID/processed" -u $USER -P $PWD';
              $scope.devInfo.mqtt.topic = settings.ENV_ID + "/ubirch/devices/$DEVICE_ID/processed";
            }
          },
          function (error) {
            $log.warn("On loading device details an error uccurred: "+error);
          }

        );

        var deviceDetailsPromise;

        //********************* device state ********************//
        // polling the state of device
        // (polling history happens in range-filter directive!)
        //*******************************************************//

        (function refreshData() {
          // Assign to scope within callback to avoid data flickering on screen

          if ($scope.loadDeviceState){
            Device.getDeviceState($stateParams.deviceid,
              function(data){

                var collector = {}, stateKatsCollector = [];

                angular.forEach( data, function(katObj, kat){
                  // don't add $promise, $resolved aso
                  if (!kat.startsWith("$")){
                    if (typeof katObj !== "object"){
                      $scope[kat] = katObj;
                    }
                    else {
                      var kategory = kat;
                      // save the parameter name for row identification
                      stateKatsCollector.push(kategory);

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
                $scope.stateKats = stateKatsCollector;

                deviceStateSaved = angular.copy($scope.deviceState);

                if (deviceDetailsPromise !== undefined){
                  $timeout.cancel(deviceDetailsPromise);
                }
                deviceDetailsPromise = $timeout(refreshData, constants.POLLING_INTERVAL);
              },
              function(error){
                $scope.loadDeviceState = false;
                $log.warn("No device state available; error uccurred: "+error);
              });
          }

        })();
        $scope.$on('$destroy', function(){
          if (deviceDetailsPromise !== undefined){
            $timeout.cancel(deviceDetailsPromise);
          }
        });

        $scope.$on('auth:signedOut', function () {
          if (deviceDetailsPromise !== undefined){
            $timeout.cancel(deviceDetailsPromise);
          }
        });
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
      toaster.pop('info', "Sorry, changing the state of a device is not yet implemented!");
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
        $rootScope.closeModal('#myModal');

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

    $scope.generateKeyPair = function() {
      var keys = NACL.generateKeyPairAndStorePubKey(
        $scope.device.hwDeviceId,
        function (data) {
          $scope.keys = {
            hex: {
              public: NACL.formatHex(keys.publicKey),
              secret: NACL.formatHex(keys.secretKey)
            },
            ccp: {
              public: NACL.formatCCP(keys.publicKey),
              secret: NACL.formatCCP(keys.secretKey)
            }
          }
        },
        $rootScope.showError
      );
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

          var marker = markers[markerKeys[0]];
          // initialize with first marker
          var coordArray = [[marker.lat,marker.lng],[marker.lat,marker.lng]];

          markerKeys.forEach(function(key) {
            marker = markers[key];
            if (marker.lat < coordArray[0][0]){
              coordArray[0][0] = marker.lat;
            }
            if (marker.lng < coordArray[0][1]){
              coordArray[0][1] = marker.lng;
            }
            if (marker.lat > coordArray[1][0]){
              coordArray[1][0] = marker.lat;
            }
            if (marker.lng > coordArray[1][1]){
              coordArray[1][1] = marker.lng;
            }
          });

          $scope.leafletValues.bounds = leafletBoundsHelpers.createBoundsFromArray(coordArray);
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
                draggable: false,
                lat: message.deviceMessage.latitude,
                lng: message.deviceMessage.longitude,
                message: filterMessageKeys(message),
                opacity: 1 - (1 / $scope.messages.content.length * (i))
              };

              markers["marker" + i] = angular.copy(marker);
            }
          });
        }

        $scope.leafletValues.markers = markers;

        if (Object.keys(markers).length > 0){
          calculateMapExtract(markers);
          $scope.markersDefined = true;
        }
        else {
          $scope.markersDefined = false;
        }

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
