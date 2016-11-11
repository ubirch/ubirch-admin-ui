'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:messageheader
 * @description
 * # messageheader
 */
angular.module('ubirchAdminCrudApp')
  .directive('messageheader', function () {
    return {
      templateUrl: 'views/directives/messageheader.html',
      restrict: 'E',
      scope: {message: '@',
        deviceType: '@'
      },
      link: function postLink(scope) {
        scope.messageObj = angular.fromJson(scope.message);
        scope.type = scope.messageObj.deviceType;
        scope.deviceMessage = scope.messageObj.deviceMessage;
      }
    };
  });
