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
  .module('ubirchAuth', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
])
  .config(function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, $httpProvider) {

    $translateProvider.useStaticFilesLoader({
      files: [{
        prefix: 'i18n/',
        suffix: '.json'
      }]
    });

    $translateProvider.preferredLanguage('en');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: '../views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .state('device-details', {
        url: '/device-details/:deviceid',
        templateUrl: '../views/device-details.html',
        controller: 'DeviceDetailsCtrl',
        controllerAs: 'deviceDetails',
        tokenRequired: true,
        resolve:{
          deviceTypesList: function(DeviceTypes){
            return DeviceTypes.getDeviceTypeList();
          }
        }
      })
      .state('devices-list', {
        url: '/devices-list',
        templateUrl: '../views/devices-list.html',
        controller: 'DevicesListCtrl',
        controllerAs: 'devicesList',
        tokenRequired: true,
        resolve:{
          deviceTypesList: function(DeviceTypes){
            return DeviceTypes.getDeviceTypeList();
          }
        }
      })
      .state('devices-map', {
        url: '/devices-map',
        templateUrl: '../views/devices-map.html',
        controller: 'DevicesMapCtrl',
        controllerAs: 'devicesMap',
        tokenRequired: true,
        resolve:{
          deviceTypesList: function(DeviceTypes){
            return DeviceTypes.getDeviceTypeList();
          }
        }
      })
      .state('about', {
        url: '/about',
        templateUrl: '../views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      });

    $locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.otherwise('devices-list');

    $httpProvider.interceptors.push('OAuth2Interceptor');
  })
  .run(['$rootScope', '$location', '$sessionStorage',
    function ($rootScope, $location, $sessionStorage) {

      $rootScope.$on('$stateChangeStart', function (event, next) {

        if (next.tokenRequired && !$sessionStorage.token) {
          $location.path('/login');
        }
      });
    }])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]);
