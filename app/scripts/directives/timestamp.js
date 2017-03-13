'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:timestamp
 * @description
 * # timestamp
 */
angular.module('ubirchAdminCrudApp')
  .directive('timestamp', [ 'constants' , function (constants) {
    return {
      templateUrl: 'views/directives/timestamp.html',
      restrict: 'E',
      replace: true,
      scope: {date: '@'
      },
      link: function postLink(scope) {

        if (constants.TODAY === undefined){
          var now = new Date();
          constants.TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          constants.TOMORROW = constants.TODAY + 1000*60*60*24;
        }

        scope.isToday = function(dateStr) {
          if (dateStr === undefined){ return false; }
          var date = new Date(dateStr);
          return (date > constants.TODAY && date < constants.TOMORROW);
        }
      }
    };
  }]);
