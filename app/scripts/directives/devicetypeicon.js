'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:devicetypeicon
 * @description
 * # devicetypeicon
 */
angular.module('ubirchAdminCrudApp')
  .directive('devicetypeicon', function () {
    return {
      template: '<i class="sensor-type-icon {{iconStr}}"></i>',
      restrict: 'E',
      replace: true,
      scope: {deviceType: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.iconStr = "ion-radio-waves";

        if( attrs.deviceType !== undefined) {

          switch (attrs.deviceType) {
            case "lightsSensor":
              scope.iconStr = "ion-ios-lightbulb";
              break;
            case "temperaturesSensor":
              scope.iconStr = "ion-thermometer";
              break;
            case "noisesSensor":
              scope.iconStr = "ion-mic-c";
              break;
            case "wetnessSensor":
              scope.iconStr = "ion-waterdrop";
              break;
            default:
              scope.iconStr = "ion-radio-waves";
          }
        }
      }
    };
  });
