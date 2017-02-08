'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.authService
 * @description
 * # authService
 * Service in the ubirchAdminCrudApp.
 */
var app = angular.module('ubirchAuth', ['ngStorage']);

app.factory('AccessToken', ['$rootScope', '$location', '$sessionStorage', function($rootScope, $location, $sessionStorage) {
  var service = {
    token: null
  };
  var openIDConnectHashParams = ['code', 'state', 'session_state', 'access_token', 'token_type', 'expires_in', 'scope', 'nonce', 'authuser', 'error', 'error_description'];

  function setExpiresAt(token) {
    if(token){
      var expires_at = new Date();
      var expires_in = token.expires_in ? parseInt(token.expires_in)-60 : 60; // 60 seconds less to secure browser and response latency or 1min for testing -> TODO
      token.expires_at = expires_at + expires_in;
    }
  }

  function setTokenFromHashParams(hash) {
    var token = getTokenFromHashParams(hash);
    if (token !== null) {
      $sessionStorage.token = token;
    }
    return token;
  }

  function getTokenFromHashParams(hash) {
    var token = {};
    var regex = /([^&=]+)=([^&]*)/g;
    var m;

    while (m = regex.exec(hash)) {
      var param = decodeURIComponent(m[1]);
      var value = decodeURIComponent(m[2]);

      if (openIDConnectHashParams.indexOf(param) >= 0) {
        token[param] = value;
      }
    }

    if(token.code || token.access_token || token.error){
      setExpiresAt(token);
      return token;
    }
    return null;
  }

  service.get = function() {
    return this.token;
  };
  service.set = function() {
    // Try and get the token from the hash params on the URL
    var hashValues = window.location.hash;

    if (hashValues.length > 0) {
      var query = hashValues.substr(hashValues.indexOf("?")+1);
      service.token = setTokenFromHashParams(query);
    }

    if (service.token === null && $sessionStorage.token != undefined) {
      service.token = $sessionStorage.token;
    }

    if (service.token && service.token.error) {
      var error = service.token.error;
      service.destroy();
      $rootScope.$broadcast('auth:authError', error);
    }

    if (service.token !== null && $sessionStorage.oauthRedirectRoute) {
      var path = $sessionStorage.oauthRedirectRoute;
      $sessionStorage.oauthRedirectRoute = null;
      $location.path(path);
    }

    return service.token;
  };

  service.expired = function(token) {
    return (token && token.expires_at && new Date(token.expires_at) < new Date());
  };

  service.destroy = function() {
    $sessionStorage.token = null;
    delete $sessionStorage.token;
    service.token = null;
  };

  return service;
}]);

app.service('AuthService', ['$resource', 'constant', 'settings', '$log', function ($resource, constant, settings, $log) {

    var url = settings.UBIRCH_AUTH_SERVICE_API_HOST + constant.AUTH_SERVICE_REST_ENDPOINT;

    return {
      // http://localhost:8091/api/loginService/v1/providerInfo/list
      providerInfo: $resource(url + '/providerInfo/list'),

      verifyAuth: $resource(url + '/verify/code', {providerId: '@providerId', code: '@code', state: '@state'})
    }
  }]);

app.factory('OAuth2Interceptor', ['$rootScope', '$q', '$sessionStorage', '$location', 'AccessToken', function ($rootScope, $q, $sessionStorage, $location, AccessToken) {

  var service = {
    request: function(config) {
      var token = $sessionStorage.token;
      if (AccessToken.expired(token)) {
        $rootScope.$broadcast('oauth2:authExpired', token);
      }
      else if (token) {
        // config.headers.Authorization = 'Bearer ' + token.code;
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
