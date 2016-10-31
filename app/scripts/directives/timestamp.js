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
      link: function postLink(scope, element, attrs) {

        scope.date = attrs.date;

        if (constant.TODAY === undefined){
          var d = new Date();
          d.setHours(0);
          d.setMinutes(0);
          d.setSeconds(0);
          constant.TODAY = d;
        }

        scope.fromToday = new Date(attrs.date) >= constant.TODAY;
      }
    };
  }]);