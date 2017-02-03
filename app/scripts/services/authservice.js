'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.authService
 * @description
 * # authService
 * Service in the ubirchAdminCrudApp.
 */
var app = angular.module('ubirchAuth', []);

app.service('AuthService', ['$resource', 'constant', 'settings', '$log', function ($resource, constant, settings, $log) {

    var url = settings.UBIRCH_AUTH_SERVICE_API_HOST + constant.AUTH_SERVICE_REST_ENDPOINT;

    return {
      // http://localhost:8091/api/loginService/v1/providerInfo/list
      providerInfo: $resource(url + '/providerInfo/list')


    }
  }]);

app.factory('OAuth2Interceptor', ['$rootScope', '$q', '$sessionStorage', '$location', function ($rootScope, $q, $sessionStorage, $location) {
  var expired = function(token) {
    return (token && token.expires_at && new Date(token.expires_at) < new Date());
  };

  var service = {
    request: function(config) {
      var token = $sessionStorage.token;
      if (expired(token)) {
        $rootScope.$broadcast('oauth2:authExpired', token);
      }
      else if (token) {
        config.headers.Authorization = 'Bearer ' + token.code;
        return config;
      }
      return config;
    },

    responseError: function (rejection) {//error
      console.log('Failed with', rejection.status, 'status');
      if (rejection.status === 401) {
        $location.url('/login');
        return $q.reject(rejection);
      }

      return $q.reject(rejection);
    }

  };
  return service;
}]);
