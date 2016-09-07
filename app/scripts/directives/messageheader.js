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
      scope: {message: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.mess = angular.fromJson(attrs.message);
      }
    };
  });
