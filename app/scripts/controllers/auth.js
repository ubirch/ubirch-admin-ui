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
    $scope.warning = undefined;


    $scope.$on('auth:authError', function (event, error) {
      $scope.success = false;
      $scope.workinprogress = false;
      $scope.error = error;
    });

    $scope.$on('auth:alreadyRegisteredLogin', function (event, user) {
      $scope.workinprogress = false;
      angular.element('#registeredModal').modal('show');
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

    $scope.$on('auth:loggedIn', function (event, user) {
      $scope.success = true;
      $scope.workinprogress = false;
      $location.url('/');
    });

    $scope.$on('auth:registrationRequired', function () {
      $scope.workinprogress = false;
      angular.element('#registrationModal').modal('show');
    });

    $scope.$on('auth:signedOut', function () {
      $scope.success = false;
      $scope.workinprogress = false;
      $location.url('/login');
    });

    AuthService.verify();

    $scope.register = function () {
      angular.element('#registrationModal').modal('hide');
      AuthService.register();
    };

    $scope.noRegistration = function () {
      angular.element('#registrationModal').modal('hide');
      $scope.workinprogress = false;
      $location.url('/login');
    };

    $scope.closeRegisteredModal = function () {
      angular.element('#registeredModal').modal('hide');
      $scope.$broadcast('auth:loggedIn');
    };

    $scope.openLogin = function(){
      $location.url('/login');
    }
  }]);
