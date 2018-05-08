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

        var colors = ['red', 'darkgreen', 'blue', 'orange', 'black',
            'gray', 'purple', 'green', 'beige', 'darkblue',
            'pink', 'cadetblue', 'lightgray', 'lightgreen', 'darkred',
           'lightblue', 'darkpurple', 'lightred'
          ],
        num_of_colors = colors.length,
        color_used_by = [],
        color_in_use = [];

        for (var i=0;i<num_of_colors;i++){
          color_in_use[i] = "0";
        }

        /**
         * check for next free color for device history markers:
         * tries to keep color that has been used for device before;
         * if all colors have been assigned once, tries to reuse not longer used colors from the beginning of the color array;
         * if no more colors are available, black is returned as a default
         * @param deviceId: id of the selected device (history markers shall be displayed)
         * @returns {string} color
         */
        function selectFreeColor(deviceId) {
          var color_num = color_used_by.indexOf(deviceId);
          if (color_num === -1) {
            // new deviceId: add at the end of array
            color_num = color_used_by.push(deviceId)-1; // position = length-1

            if (color_num >= num_of_colors){
              // end of color array is reached -> try to use the first unused color
              color_num = color_in_use.indexOf("0");
              if (color_num === -1){
                // no more free colors -> return black
                return colors[0];
              }
              color_used_by[color_num] = deviceId;  //color in use by device with given id
              color_in_use[color_num] = "1";  //mark color to be in use
            }
          }
          return colors[color_num];
        }

        /**
         * mark color as unused when device is unselected
         * @param deviceId: id of the device that has been deselected (history markers no longer displayed)
         */
        function markColorAsUnused(deviceId) {
          var color_num = color_used_by.indexOf(deviceId);
          if (color_num > -1) {
            color_in_use[color_num] = "0";
          }
        }

        // init map with europe bounds and cleanup markers
        var centerLatInit = parseFloat(50.91);
        var centerLngInit = parseFloat(13.75);
        scope.center = {
          lat: centerLatInit,
          lng: centerLngInit,
          zoom: 5
        };
        scope.markers = {};

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

              // TODO: add boundary

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

          markColorAsUnused(device.deviceId);
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

              var markerLat = m.la ? parseFloat(m.la) : m.location.lat ? parseFloat(m.location.lat) : undefined;
              var markerLng = m.lo ? parseFloat(m.lo) : m.location.lon ? parseFloat(m.location.lon) : undefined;

              if (markerLat && markerLng){

                if (device.markerColor === undefined){
                  device.markerColor = selectFreeColor(device.deviceId);
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
                    icon: 'ion-radio-waves',  // TODO: get icon from device data
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
            else if (key != "location.lat" && key != "location.lon") {
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
