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
        scope.deleteField = function(key, index, isNew){
          switch (key) {
            case 'property':
              if (isNew){
                scope.addedProperties.properties.splice(index, 1);
              }
              else {
                delete scope.device.deviceProperties[index];
              }
              break;
            case 'config':
              if (isNew){
                scope.addedProperties.config.splice(index, 1);
              }
              else {
                delete scope.device.deviceConfig[index];
              }
              break;
            case 'tag':
              if (isNew){
                scope.addedProperties.tags.splice(index, 1);
              }
              else {
                scope.device.tags.splice(index, 1);
              }
              break;
          }
        };
      }
    };
  });
