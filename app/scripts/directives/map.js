'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:map
 * @description
 * # map
 */
angular.module('ubirchAdminCrudApp')
  .directive('map', [ function () {
    return {
      templateUrl: 'views/directives/map.html',
      restrict: 'E',
      replace: true,
      link: function (scope) {

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

                    var message = data[0];

                    var m = message.deviceMessage;
                    var centerLat = m.la?parseFloat(message.deviceMessage.la) : m.latitude?parseFloat(message.deviceMessage.latitude):centerLatInit;
                    var centerLng = m.lo?parseFloat(message.deviceMessage.lo) : m.longitude?parseFloat(message.deviceMessage.longitude):centerLngInit;

                    scope.center = {
                      lat: centerLat,
                      lng: centerLng,
                      zoom: 15
                    };
                  }
                }
              )
            }

          }
        });
      }
    };
  }]);
