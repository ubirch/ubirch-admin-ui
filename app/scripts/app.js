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
    'toaster',
    'ngStorage',
    'oauth2.directive',      // login directive
    'oauth2.accessToken',    // access token service
    'oauth2.endpoint',       // oauth endpoint service
    'oauth2.interceptor'     // bearer token interceptor
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
      .state('auth', {
        abstract: true, // this state can not be activated itself and must be a parent
        template: '<ui-view/>', // needed in order to inject the children into the view
        resolve: {
          user: ['$q', function ($q) {
            var d = $q.defer();
            if (false) {
              // I also provide the user for child controllers
              d.resolve(auth.user);
            } else {
              // here the rejection
              d.reject('not logged');
            }
            return d.promise;
          }]
        }
      })
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
        resolve:{
          deviceTypesList: function(DeviceTypes){
            return DeviceTypes.getDeviceTypeList();
          }
        },
        parent: 'auth'
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
        },
        parent: 'auth'
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
        },
        parent: 'auth'
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
  .run(['$rootScope', '$location',
    function ($rootScope,   $location) {

      $rootScope.$on('$stateChangeStart', function (event, next) {
        if (next.name != "login") {
          $location.path('/login');
          return $q.reject(rejection);
        }
      });
    }]);
