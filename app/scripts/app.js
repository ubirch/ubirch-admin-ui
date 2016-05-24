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
    'ngTouch',
    'pascalprecht.translate'
  ])
  .config(function ($routeProvider, $translateProvider) {

    $translateProvider.useStaticFilesLoader({
      files: [{
        prefix: 'i18n/',
        suffix: '.json'
      }]
    });

    $translateProvider.preferredLanguage('en');

    $routeProvider
      .when('/device-details/:deviceid', {
        templateUrl: 'views/device-details.html',
        controller: 'DeviceDetailsCtrl',
        controllerAs: 'deviceDetails'
      })
      .when('/devices-list', {
        templateUrl: 'views/devices-list.html',
        controller: 'DevicesListCtrl',
        controllerAs: 'devicesList'
      })
      .when('/device-crud/:deviceid?', {
        templateUrl: 'views/device-crud.html',
        controller: 'DeviceCrudCtrl',
        controllerAs: 'deviceCrud'
      })
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
      .otherwise({
        redirectTo: '/'
      });
  });
