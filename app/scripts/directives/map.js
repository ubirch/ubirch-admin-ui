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

        (function init() {
          var centerLatInit = parseFloat(50.91);
          var centerLngInit = parseFloat(13.75);

          scope.center = {
            lat: centerLatInit,
            lng: centerLngInit,
            zoom: 5
          };
        })();

        scope.$watch("selected.size", function(newSize){
          if (newSize>0){
            var ids = Object.keys(scope.selected.devices);
            var device = scope.selected.devices[ids[0]];

            if (device.messages !== undefined){

              device.messages.$promise.then(
                function (data) {
                  if (data.length > 0) {

                    calculateMap(device);

                  }
                }
              )
            }

          }
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

            scope.bounds = leafletBoundsHelpers.createBoundsFromArray(coordArray);
          }
          else {
            scope.bounds = {};
          }
        }

        function calculateMap(device) {

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

                markers["marker" + i] = angular.copy(marker);
              }
            });
          }

          scope.markers = markers;

          if (Object.keys(markers).length > 0){
            calculateMapExtract(markers);
            scope.markersDefined = true;
          }
          else {
            scope.markersDefined = false;
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

      }
    };
  }]);
