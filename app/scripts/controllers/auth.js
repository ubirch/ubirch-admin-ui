'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('AuthCtrl',['$scope', 'AccessToken', 'AuthService', function ($scope, AccessToken, AuthService) {

    $scope.workinprogress = true;
    $scope.token = "";

    AccessToken.set();

    var token = AccessToken.get();
    if (token && token.code && token.state){
      AuthService.verifyAuth.save(
        { "providerId": "google",
          "code": token.code,
          "state": token.state
        },
        function(data){
          $scope.token = data;
        },
        function(error){
          $scope.token = error;
        }
      )
    }

  }]);
