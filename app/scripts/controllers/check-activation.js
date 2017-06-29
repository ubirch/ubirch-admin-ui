'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:CheckActivationCtrl
 * @description
 * # CheckActivationCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('CheckActivationCtrl', ['$scope', '$location', 'UserService', function ($scope, $location, UserService) {

    $scope.workinprogress = true;
    $scope.notactivated = undefined;


    UserService.getAccount().$promise.then(
      function(res){
        var isActivated = res.activeUser === true ? true : false;
        UserService.setActivationFlag(isActivated);
        if (isActivated) {
          $scope.workinprogress = false;
          $scope.notactivated = false;
          $location.url('/');
        }
        else {
          $scope.workinprogress = false;
          $scope.notactivated = true;
        }
      }
    );
  }]);
