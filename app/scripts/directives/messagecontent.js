'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:messagecontent
 * @description
 * # messagecontent
 */
angular.module('ubirchAdminCrudApp')
  .directive('messagecontent', function () {
    return {
      templateUrl: 'views/directives/messagecontent.html',
      restrict: 'E',
      scope: {message: '@',
        deviceType: '@'
      },
      link: function postLink(scope) {
        scope.messageObj = angular.fromJson(scope.message);
        scope.type = scope.messageObj.deviceType;
        scope.deviceMessage = scope.messageObj.deviceMessage;
        scope.messageKeys = Object.keys(scope.deviceMessage);
      }
    };
  });
