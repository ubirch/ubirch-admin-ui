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
    'ui.router',
    'leaflet-directive',
    'ui.bootstrap',
    'angularUUID2',
    'toaster'
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
        controllerAs: 'deviceDetails',
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

    $urlRouterProvider.otherwise('devices-list');
  })
  .run(['constant', function (constant) {

    if (constant.TODAY === undefined){
      var now = new Date();
      constant.TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      constant.ONEDAY = 1000*60*60*24;
      constant.TOMORROW = constant.TODAY + constant.ONEDAY;
    }
  }]);
