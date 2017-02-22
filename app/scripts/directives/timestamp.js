'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:timestamp
 * @description
 * # timestamp
 */
angular.module('ubirchAdminCrudApp')
  .directive('timestamp', [ 'constant' , function (constant) {
    return {
      templateUrl: 'views/directives/timestamp.html',
      restrict: 'E',
      replace: true,
      scope: {date: '@'
      },
      link: function postLink(scope) {

        scope.isToday = function(dateStr) {
          if (dateStr === undefined){ return false; }
          var date = new Date(dateStr);
          return (date > constant.TODAY && date < constant.TOMORROW);
        }
      }
    };
  }]);
