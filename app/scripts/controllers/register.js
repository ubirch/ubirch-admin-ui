'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('RegisterCtrl', [ '$scope', 'AuthService', 'buttonClassMappings', 'constants',
    function ($scope, AuthService, mapping, constants) {

    $scope.providersList = AuthService.providerInfo.query();
    $scope.user = { displayname: ""};
    $scope.initialGroup = { displayname: constants.INTIAL_GROUP_NAME};

    $scope.getButtonClass = function(providerId){
      if (mapping[providerId] && mapping[providerId].buttonClass){
        return mapping[providerId].buttonClass;
      }
      else {
        return mapping.default.buttonClass;
      }
    };

    $scope.getButtonIcon = function(providerId){
      if (mapping[providerId] && mapping[providerId].iconClass){
        return mapping[providerId].iconClass;
      }
      else {
        return mapping.default.iconClass;
      }
    };
  }]);
