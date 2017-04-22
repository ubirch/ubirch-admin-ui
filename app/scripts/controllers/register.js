'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('RegisterCtrl', [ '$scope', 'AuthService', 'UserService', 'buttonClassMappings', 'constants',
    function ($scope, AuthService, UserService, mapping, constants) {

    $scope.providersList = AuthService.providerInfo.query();
    $scope.user = { displayname: "",
                    groups: [
                      {displayname: constants.INTIAL_GROUP_NAME}
                    ]};
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
