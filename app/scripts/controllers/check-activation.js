'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:CheckActivationCtrl
 * @description
 * # CheckActivationCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('CheckActivationCtrl', ['$scope', '$location', '$log', 'UserService', 'constants', '$timeout',
    function ($scope, $location, $log, UserService, constants, $timeout) {

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

    (function reloadUserData() {
      UserService.getAccount().$promise.then(
        gotAccountData,
        function (error) {
          if (error.data.errorType === "NoUserInfoFound"){
                $timeout(reloadUserData, constants.POLLING_INTERVAL);
                $log.warn("No NoUserInfoFound: "+error);
          }
          console.log(error);
        }
      );

    })();
  }]);
