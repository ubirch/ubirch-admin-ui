'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:map
 * @description
 * # map
 */
angular.module('ubirchAdminCrudApp')
  .directive('map', ['DeviceTypes', '$filter', 'leafletBoundsHelpers', function (DeviceTypes, $filter, leafletBoundsHelpers) {
    return {
      templateUrl: 'views/directives/map.html',
      restrict: 'E',
      replace: true,
      link: function (scope) {

        var colors = ['black', 'red','darkred', 'lightred', 'orange',
          'beige', 'green', 'darkgreen', 'lightgreen', 'blue',
          'darkblue', 'lightblue', 'purple', 'darkpurple', 'pink',
          'cadetblue', 'gray', 'lightgray'];

        /**
         * TODO: check for next free color
         * @returns {number}
         */
        function selectFreeColor() {
          return colors[0];
        }

        /**
         * TODO: mark color as unused when device is unselected
         * @param color
         */
        function markColorAsUnused(color) {

        }

        (function init() {
          var centerLatInit = parseFloat(50.91);
          var centerLngInit = parseFloat(13.75);

          scope.center = {
            lat: centerLatInit,
            lng: centerLngInit,
            zoom: 5
          };
        })();

        scope.$watch("lastAddedDevice", function(device){
          if (device !== undefined && device.messages !== undefined){
            device.messages.$promise.then(
              function (data) {
                if (data.length > 0) {

                  addMarkers(device);

                }
              }
            )
          }
        });

        scope.$watch("lastRemovedDevice", function(device){
          if (device !== undefined){
              removeMarkers(device);
          }
        });

        function calculateMapExtract(markers) {
          if (Object.keys(scope.markers).length > 0) {
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

              scope.bounds = leafletBoundsHelpers.createBoundsFromArray(coordArray);
            }
            else {
              scope.bounds = {};
            }
            return true;
          }
          else {
            return false;
          }

        }

        function removeMarkers(device) {

          markColorAsUnused(device.markerColor);
          delete device.markerColor;

          var praefix = createMarkerName(device.deviceId, "");

          Object.keys(scope.markers).forEach( function(markerName){
            if (markerName.indexOf(praefix) === 0){
              delete scope.markers[markerName];
            }
          });

          scope.markersDefined = calculateMapExtract(scope.markers);

        }

        function addMarkers(device) {

          var messages = device.messages;

          var markers = {};

          if (messages) {

            messages.forEach(function (message, i) {

              var m = message.deviceMessage;

              var markerLat = m.la?parseFloat(m.la) : m.latitude?parseFloat(m.latitude) : undefined;
              var markerLng = m.lo?parseFloat(m.lo) : m.longitude?parseFloat(m.longitude) : undefined;

              if (markerLat && markerLng){

                if (device.markerColor === undefined){
                  device.markerColor = selectFreeColor();
                }
                var marker = {
                  focus: false,
                  draggable: false,
                  lat: markerLat,
                  lng: markerLng,
                  message: filterMessageKeys(message),
                  icon: {
                    type: 'awesomeMarker',
                    prefix: 'ion',
                    icon: 'ios-lightbulb',
                    markerColor: device.markerColor
                  },
                  opacity: 1 - (1 / messages.length * (i))
                };

                scope.markers[createMarkerName(device.deviceId, i)] = angular.copy(marker);
              }
            });
          }

          scope.markersDefined = calculateMapExtract(scope.markers);

        }

        var devicePraefixes = [];

        function createMarkerName (deviceId, index) {
          var praefix = devicePraefixes.indexOf(deviceId);
          if (praefix === -1) {
            // new deviceId
            praefix = devicePraefixes.push(deviceId);
            praefix = devicePraefixes.indexOf(deviceId);
          }
          return praefix + "_" + index;
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

      }
    };
  }]);
