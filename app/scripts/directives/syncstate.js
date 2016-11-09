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
      scope: {syncState: '@'
      }
    };
  });
