'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:GlobalDeveloperSettingsCtrl
 * @description
 * # GlobalDeveloperSettingsCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('GlobalDeveloperSettingsCtrl',['$scope', '$sessionStorage', 'constants', 'KeyService', 'UserService',
    function ($scope, $sessionStorage, constants, KeyService, UserService) {

    $scope.devInfo = {};

    function initInfos() {
      $scope.devInfo = {
        avatarServiceDocuUrl: constants.AVATAR_SERVICE_DOCUMENTATION,
        ubirchProtocolDocuUrl: constants.UBIRCH_PROTOCOL_DOCUMENTATION,
        token: $sessionStorage.token.token,
        tokenPraefix: constants.TOKEN_PRAEFIX,
        tokenSuffix: constants.TOKEN_SUFFIX,
        bePubKey: KeyService.getBEPubKey()
      };
      UserService.getAccount().$promise.then(
        function (acc) {
          var groups = [];
          if (acc.myGroups) {
            angular.forEach(acc.myGroups, function (value, key) {
              groups.push(value.displayName);
            });
          }
          if (acc.allowedGroups) {
            angular.forEach(acc.allowedGroups, function (value, key) {
              groups.push(value.displayName);
            });
          }
          $scope.devInfo.groupList = groups.toString();
        })
    }

    initInfos();

  }]);
