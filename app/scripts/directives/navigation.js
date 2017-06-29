'use strict';

/**
 * @ngdoc directive
 * @name wtCdbGuiApp.directive:navigation
 * @description
 * # navigation
 */
angular.module('ubirchAdminCrudApp')
  .directive('navigation', function () {
    return {
      templateUrl: 'views/directives/navigation.html',
      restrict: 'E',
      controllerAs: 'navCtrl',
      controller: ['$scope', '$rootScope', '$location', 'AuthService', 'UserService',
        function ($scope, $rootScope, $location, AuthService, UserService) {

        $rootScope.signedIn = !AuthService.authenticationRequired();
          $scope.account = {
            value: undefined
          };

          $rootScope.$watch("signedIn", function(signedIn){
            if (signedIn){
              UserService.getAccount().$promise.then(function (acc) {
                $scope.account.value = acc;
                $scope.account.activated = acc.activeUser === true ? true : false;
              });
            }
            else {
              $scope.account.value = undefined;
              $scope.account.activated = undefined;
            }
          });


        // highlighting
        $scope.navClass = function (page) {

          var currentRoute = $location.path().substring(1) || 'devices-list';

          if (currentRoute.indexOf('device-details') === 0){
            currentRoute = 'devices-list';
          }

          return page === currentRoute ? 'active' : '';
        };

         $scope.loadDeviceslist = function () {
          $location.url('/devices-list');
        };

        $scope.loadDevicesMap = function () {
          $location.url('/devices-map');
        };

        $scope.loadAbout = function () {
          $location.url('/about');
        };
      }]
    };
  });
