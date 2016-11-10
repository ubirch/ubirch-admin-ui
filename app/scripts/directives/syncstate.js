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
      scope: {inSync: '@'
      },
      link: function postLink(scope) {

        var getSyncState = function(newSyncValue){
          if (newSyncValue === 'true'){
            scope.showInSync = true;
          }
          else if (newSyncValue === 'false'){
            scope.showInSync = false;
          }
          else {
            scope.showInSync = undefined;
          }
        };

        getSyncState(scope.inSync);

        scope.$watch('inSync', function(newSyncValue){
          getSyncState(newSyncValue);
        });
      }
    };
  });
