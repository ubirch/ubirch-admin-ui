'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('LoginCtrl', [ '$scope', 'AuthService', function ($scope, AuthService) {

    $scope.providersList = AuthService.providerInfo.query();

  }]);
