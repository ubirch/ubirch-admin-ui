'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:GlobalDeveloperSettingsCtrl
 * @description
 * # GlobalDeveloperSettingsCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('GlobalDeveloperSettingsCtrl',['$scope', '$sessionStorage', 'constants',
    function ($scope, $sessionStorage, constants) {

    $scope.devInfo = {};

    function initInfos() {
      $scope.devInfo = {
        avatarServiceDocuUrl: constants.AVATAR_SERVICE_DOCUMENTATION,
        ubirchProtocolDocuUrl: constants.UBIRCH_PROTOCOL_DOCUMENTATION,
        token: $sessionStorage.token.token,
        tokenPraefix: constants.TOKEN_PRAEFIX,
        tokenSuffix: constants.TOKEN_SUFFIX
      };
    }

    initInfos();

  }]);
