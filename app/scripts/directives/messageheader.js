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
      link: function postLink(scope, element, attrs) {
        scope.type = attrs.deviceType;
        scope.mess = angular.fromJson(attrs.message);
      }
    };
  });
