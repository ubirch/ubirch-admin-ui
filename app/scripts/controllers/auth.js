'use strict';

/**
 * @ngdoc function
 * @name ubirchAdminCrudApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ubirchAdminCrudApp
 */
angular.module('ubirchAdminCrudApp')
  .controller('AuthCtrl',['$scope', 'AccessToken', function ($scope, AccessToken) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.workinprogress = true;

    AccessToken.set();

  }]);
