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
      link: function postLink(scope, element, attrs) {
        scope.type = attrs.deviceType;
        scope.mess = angular.fromJson(attrs.message);
      }
    };
  });
