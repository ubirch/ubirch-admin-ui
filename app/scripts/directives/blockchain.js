'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:blockchain
 * @description
 * # blockchain
 */
angular.module('ubirchAdminCrudApp')
  .directive('blockchain', [ 'ChainService', '$log', function (ChainService, $log) {
    return {
      template: '<i class="sensor-trustworth-icon {{colorClass}} {{icon}}">',
      restrict: 'E',
      replace: true,
      scope: {message: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.colorClass = "grey";
        scope.icon = "ion-ios-bolt";

        // TODO: MockValue!!! Remove this!!!!
        var hash = "42e52035c9ab81c47fb48b627436011eae2f50e9dc6923dfa3a6f7647da6d587";

        var message = angular.fromJson(attrs.message);

        if (message) {
          if (message.hash){
            hash = message.hash;
          }

          ChainService.eventHash.get({eventHash: hash}, function (data) {
            $log.debug("Got block info for event hash: " + data);
            // TODO: analyze block for icon, color and additional info on click
          });

        }
      }
    };
  }]);
