'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('LoginCtrl', [ '$scope', 'AuthService', 'UserService', 'buttonClassMappings',
    function ($scope, AuthService, UserService, mapping) {

    $scope.providersList = AuthService.providerInfo.query();
    $scope.user = {};
    UserService.setUser($scope.user);

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
