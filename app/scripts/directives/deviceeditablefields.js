'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:DeviceEditableFields
 * @description
 * # DeviceEditableFields
 */
angular.module('ubirchAdminCrudApp')
  .directive('deviceEditableFields', function () {
    return {
      templateUrl: 'views/directives/deviceeditablefields.html',
      restrict: 'E',
      replace: true,
      scope: {device: '='
      },
      link: function postLink() {

      }
    };
  });
