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
    'ui-leaflet',
    'ui.bootstrap',
    'datetimepicker',
    'angularUUID2',
    'angularMoment',
    'toaster',
    'ngStorage',
    'angularSpinner',
    'ubirchAuth'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, $httpProvider) {

    $translateProvider.useStaticFilesLoader({
      files: [{
        prefix: 'i18n/',
        suffix: '.json'
      }]
    })
    .registerAvailableLanguageKeys(['en', 'de'], {
      'en_*': 'en',
      'de_*': 'de',
      '*': 'en'
    })
    .determinePreferredLanguage();

    $stateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: '../views/auth.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      })
      .state('login', {
        url: '/login',
        templateUrl: '../views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .state('register', {
        url: '/register',
        templateUrl: '../views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .state('not-activated', {
        url: '/not-activated',
        templateUrl: '../views/not-activated.html',
        controller: 'notActivatedCtrl',
        controllerAs: 'notActivated',
        tokenRequired: true
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

    $urlRouterProvider.otherwise('devices-list');

    $httpProvider.interceptors.push('OAuth2Interceptor');
  }])
  .run(['$rootScope', '$location', 'AuthService', 'constants',
  function ($rootScope, $location, AuthService, constants) {

    if (constants.TODAY === undefined){
      var now = new Date();
      constants.TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      constants.ONEDAY = 1000*60*60*24;
      constants.TOMORROW = constants.TODAY.getTime() + constants.ONEDAY;
      constants.TODAY_END = constants.TOMORROW - 1;
    }

    $rootScope.$on('$stateChangeStart', function (event, next) {
      if (next.tokenRequired) {
        if (AuthService.authenticationRequired()) {
          $location.path('/auth');
        } else {
          AuthService.getUserInfo(
            function (res) {
              $rootScope.account = res;
            }
          );
        }
      }
    });

    $rootScope.closeModal = function (modalId) {
      angular.element(modalId).modal('hide');
      angular.element('body').removeClass("modal-open");
      angular.element('.modal-backdrop').remove();
    }
  }])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]);
