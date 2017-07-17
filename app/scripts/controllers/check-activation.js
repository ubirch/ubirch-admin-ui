'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:CheckActivationCtrl
 * @description
 * # CheckActivationCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('CheckActivationCtrl', ['$scope', '$location', '$log', 'UserService',
    function ($scope, $location, $log, UserService) {

    $scope.workinprogress = true;
    $scope.notactivated = undefined;


    var gotAccountData = function(res){
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
    };

    UserService.getAccount().$promise.then(
      gotAccountData,
      function (error) {
        if (error.data.errorType === "NoUserInfoFound"){
              $log.warn("No userInfo found: "+error);
        }
      }
    );

  }]);
