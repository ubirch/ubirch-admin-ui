'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:listFilter
 * @description
 * # listFilter
 */
angular.module('ubirchAdminCrudApp')
  .directive('listFilter', [ '$rootScope', function ($rootScope) {
    return {
      templateUrl: 'views/directives/list-filter.html',
      restrict: 'E',
      scope: {
        search: '='
      },
      link: function postLink(scope) {
        if ($rootScope.search === undefined){
          $rootScope.search = {};
        }
        scope.search = $rootScope.search;


      }
    };
  }]);
