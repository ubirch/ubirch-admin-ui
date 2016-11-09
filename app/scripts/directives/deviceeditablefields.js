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
      scope: {device: '=',
        addedProperties: '='
      },
      link: function postLink(scope) {

        scope.add = function(key){
          switch (key) {
            case 'property':
              scope.addedProperties.properties.push(
                {
                  key: "",
                  value: ""
                }
              );
              break;
            case 'config':
              scope.addedProperties.config.push(
                {
                  key: "",
                  value: ""
                }
              );
              break;
            case 'tag':
              scope.addedProperties.tags.push(
                {
                  value: ""
                }
              );
              break;
          }
        };
      }
    };
  });
