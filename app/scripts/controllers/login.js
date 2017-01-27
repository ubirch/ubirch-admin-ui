'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('LoginCtrl', [ '$scope', 'Auth', function ($scope, Auth) {

    $scope.params = {
      authorizationUrl: "https://github.com/login/oauth/authorize",
      clientId: "4b423118df944c3653b1",
      redirectUrl: "http://localhost:9000",
      signOutRedirectUrl: "http://localhost:9000",
      responseType: "token",
      scope: "openid",
      state: "",
      signOutUrl: "",
      signOutAppendToken: ""
    };

    $scope.authenticate = function(OP) {
      Auth.init($scope.params);
      Auth.authorize();
    };

  }]);
