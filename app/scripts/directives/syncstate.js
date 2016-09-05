'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:syncstate
 * @description
 * # syncstate
 */
angular.module('ubirchAdminCrudApp')
  .directive('syncstate', function () {
    return {
      templateUrl: 'views/directives/syncstate.html',
      restrict: 'E',
      replace: true,
      scope: {device: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.inSync = undefined;

        var device = angular.fromJson(attrs.device);
        if (device.syncState === 'insync'){
          scope.inSync = true;
        }
        else if (device.syncState === 'outofsync'){
          scope.inSync = false;
        }
      }
    };
  });
