'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('AuthCtrl',['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

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

    $scope.$on('auth:authRequired', function () {
      $scope.success = false;
      $scope.workinprogress = false;
      $location.url('/login');
    });

    $scope.$on('auth:verified', function () {
      $scope.success = true;
      $scope.workinprogress = false;
      $location.url('/');
    });

    AuthService.verifyAuth.verify();

    $scope.openLogin = function(){
      $location.url('/login');
    }
  }]);
