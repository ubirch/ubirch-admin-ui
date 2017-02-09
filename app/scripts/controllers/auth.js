'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('AuthCtrl',['$scope', '$rootScope', '$location', 'AccessToken', 'AuthService', function ($scope, $rootScope, $location, AccessToken, AuthService) {

    $scope.workinprogress = true;
    $scope.error = undefined;
    $scope.authExpired = undefined;
    $scope.success = undefined;


    $scope.$on('auth:authError', function (event, error) {
      $scope.success = false;
      $scope.workinprogress = false;
      $scope.error = error;
    });

    $scope.$on('auth:authExpired', function (event, error) {
      $scope.success = false;
      $scope.workinprogress = false;
      $scope.authExpired = true;
      $scope.error = error;
    });

    $scope.$on('auth:verified', function () {
      $scope.success = true;
      $scope.workinprogress = false;
      $location.url('/');
    });

    AccessToken.set();

    var token = AccessToken.get();
    if (!token){
      $rootScope.$broadcast('auth:authError', 'Got no authentication token from OpenId Connect provider.');
    }
    else if (AccessToken.expired(token)){
      $rootScope.$broadcast('auth:authExpired', 'Your authentication token has expired. You need a new one. Please login again!');
    }
    else if (token.code && token.state){
      AuthService.verifyAuth.save(
        { "providerId": "google",
          "code": token.code,
          "state": token.state
        },
        function(data){
          $rootScope.$broadcast('auth:verified', data);
        },
        function(error){
          $rootScope.$broadcast('auth:authError', error);
        }
      )
    }
    else {
      $rootScope.$broadcast('auth:authError', "Authentication token from OpenId Connect provider didn't contain code and/or state parameter.");
    }

    $scope.openLogin = function(){
      $location.url('/login');
    }
  }]);
