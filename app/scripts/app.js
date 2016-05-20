'use strict';

/**
 * @ngdoc overview
 * @name ubirchAdminCrudApp
 * @description
 * # ubirchAdminCrudApp
 *
 * Main module of the application.
 */
angular
  .module('ubirchAdminCrudApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/device-details', {
        templateUrl: 'views/device-details.html',
        controller: 'DeviceDetailsCtrl',
        controllerAs: 'deviceDetails'
      })
      .when('/devices-list', {
        templateUrl: 'views/devices-list.html',
        controller: 'DevicesListCtrl',
        controllerAs: 'devicesList'
      })
      .when('/device-crud', {
        templateUrl: 'views/device-crud.html',
        controller: 'DeviceCrudCtrl',
        controllerAs: 'deviceCrud'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
