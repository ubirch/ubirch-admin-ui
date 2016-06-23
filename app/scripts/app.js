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
    'ngSanitize',
    'ngTouch',
    'xeditable',
    'pascalprecht.translate',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {

    $translateProvider.useStaticFilesLoader({
      files: [{
        prefix: 'i18n/',
        suffix: '.json'
      }]
    });

    $translateProvider.preferredLanguage('en');

    $stateProvider
      .state('device-details', {
        url: '/device-details/:deviceid',
        templateUrl: '../views/device-details.html',
        controller: 'DeviceDetailsCtrl',
        controllerAs: 'deviceDetails'
      })
      .state('devices-list', {
        url: '/devices-list',
        templateUrl: '../views/devices-list.html',
        controller: 'DevicesListCtrl',
        controllerAs: 'devicesList'
      })
      .state('device-crud', {
        url: '/device-crud/:deviceid?',
        templateUrl: '../views/device-crud.html',
        controller: 'DeviceCrudCtrl',
        controllerAs: 'deviceCrud'
      })
      .state('device-details-history', {
        url: '/device-details-history/:deviceid?/:numOfMessages?',
        templateUrl: '../views/device-details-history.html',
        controller: 'DeviceDetailsHistoryCtrl',
        controllerAs: 'deviceDetailsHistory'
      })
      .state('home', {
        url: '/',
        templateUrl: '../views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .state('about', {
        url: '/about',
        templateUrl: '../views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      });

    $urlRouterProvider.otherwise('/');
  });
