'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('AuthCtrl',['$scope', '$location', 'AuthService', '$rootScope', function ($scope, $location, AuthService, $rootScope) {

    $scope.workinprogress = true;
    $scope.error = undefined;
    $scope.authExpired = undefined;
    $scope.success = undefined;


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
      $rootScope.closeModal('#registrationModal');
      AuthService.register();
    };

    $scope.noRegistration = function () {
      $rootScope.closeModal('#registrationModal');
      $scope.workinprogress = false;
      $location.url('/login');
    };

    $scope.closeRegisteredModal = function () {
      $rootScope.closeModal('#registeredModal');
      $scope.$broadcast('auth:loggedIn');
    };

    $scope.openLogin = function(){
      $location.url('/login');
    };

    $scope.openRegister = function () {
      $location.url('/register');
    };
  }]);
