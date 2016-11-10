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
      },
      link: function postLink(scope) {

        var getSyncState = function(newSyncValue){
          if (newSyncValue === 'true'){
            scope.inSync = true;
          }
          else if (newSyncValue === 'false'){
            scope.inSync = false;
          }
          else {
            scope.inSync = undefined;
          }
        };

        getSyncState(scope.syncState);

        scope.$watch('syncState', function(newSyncValue){
          getSyncState(newSyncValue);
        });
      }
    };
  });
