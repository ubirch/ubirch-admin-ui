'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.authService
 * @description
 * # authService
 * Service in the ubirchAdminCrudApp.
 */
var app = angular.module('ubirchAuth', ['ngStorage']);

app.factory('AccessToken', ['$rootScope', '$location', '$sessionStorage', 'settings', function($rootScope, $location, $sessionStorage, settings) {
  var service = {
    token: null
  };
  var openIDConnectHashParams = ['code', 'state', 'session_state', 'access_token', 'token_type', 'expires_in', 'scope', 'nonce', 'authuser', 'error', 'error_description'];

  function setExpiresAt(token) {
    if(token){
      if (token.expires_in || settings.DEFAULT_AUTH_EXPIRED_SECS >= 0){
        var expires_at = new Date();
        var expires_in = token.expires_in ? parseInt(token.expires_in)-60 : settings.DEFAULT_AUTH_EXPIRED_SECS; // 60 seconds less to secure browser and response latency or default from settings

        expires_at.setSeconds(expires_at.getSeconds()+expires_in); // 60 seconds less to secure browser and response latency

        token.expires_at = expires_at;
      }
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

app.service('AuthService', ['$resource', 'constant', 'settings', '$rootScope', '$location', 'AccessToken', function ($resource, constant, settings, $rootScope, $location, AccessToken) {

    var url = settings.UBIRCH_AUTH_SERVICE_API_HOST + constant.AUTH_SERVICE_REST_ENDPOINT;

    var service = {
      // http://localhost:8091/api/loginService/v1/providerInfo/list
      providerInfo: $resource(url + '/providerInfo/list'),

      verifyAuth: $resource(url + '/verify/code'),

      service: {
        providerId: "",
        authorizationUrl: "",
        signOutRedirectUrl: "",
        init: function (params) {
          this.authorizationUrl = params.authorizationUrl;
          this.signOutRedirectUrl = params.signOutRedirectUrl;
          this.providerId = params.providerId;
        },
        authorize: function () {
          if (this.authorizationUrl && this.authorizationUrl.length > 0) {
            window.location.replace(this.authorizationUrl);
          }
        },
        signOut: function () {
          AccessToken.destroy();
          $location.url(this.signOutRedirectUrl);
        }
      }
    };

  service.verifyAuth.verify = function() {

    AccessToken.set();

    var token = AccessToken.get();
    if (!token){
      $rootScope.$broadcast('auth:authError', 'Got no authentication token from OpenId Connect provider.');
    }
    else if (AccessToken.expired(token)){
      $rootScope.$broadcast('auth:authExpired', 'Your authentication token has expired. You need a new one. Please login again!');
    }
    else if (token.code && token.state){
      this.save(
        { "providerId": "google",
          "code": token.code,
          "state": token.state
        },
        function(data){
          $rootScope.$broadcast('auth:verified', data);
        },
        function(error){
          $rootScope.$broadcast('auth:authError', error);
        }
      )
    }
    else {
      $rootScope.$broadcast('auth:authError', "Authentication token from OpenId Connect provider didn't contain code and/or state parameter.");
    }
  };

  return service;

}]);

app.factory('OAuth2Interceptor', ['$rootScope', '$q', '$sessionStorage', '$location', 'AccessToken', function ($rootScope, $q, $sessionStorage, $location, AccessToken) {

  var service = {
    request: function(config) {
      var token = $sessionStorage.token;
      if (token && !AccessToken.expired(token)) {
        // TODO: uncomment to send token to app
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


// Open ID directive
app.directive('authButton',
  ['$rootScope', '$http', '$location', '$templateCache', '$compile', '$sessionStorage', 'AccessToken', 'AuthService',
    function($rootScope, $http, $location, $templateCache, $compile, $sessionStorage, accessToken, AuthService) {
      var definition = {
        restrict: 'E',
        replace: true,
        scope: {
          template: '@',					// template for the button, defaults to the one supplied by bower
          buttonClass: '@',				// the class to use for the sign in / out button - defaults to btn btn-primary
          buttonIconClass: '@',   // the ionicons, fontawesome or glyphicons class to add icon to button - dafaults to glyphicon glyphicon-log-in
          signInText: '@',				// text for the sign in button
          signOutText: '@',				// text for the sign out button

          providerId: '@',        // id of openid connect provider
          authorizationUrl: '@',  // authorization server url
          signOutRedirectUrl: '@' // redirect url after locally deleting token to logout user (leave user logged in against OP)
        }
      };

      definition.link = function(scope, element) {
        function compileTemplate() {
          $http.get(scope.template, { cache: $templateCache }).then(function(response) {
            element.html(response.data);
            $compile(element.contents())(scope);
          });
        }

        function init() {
          scope.template = scope.template || 'views/templates/social-media-button.html';
          scope.buttonClass = scope.buttonClass || 'btn btn-primary';
          scope.buttonIconClass = scope.buttonIconClass || 'glyphicon glyphicon-log-in';
          scope.signInText = scope.signInText || 'Sign In';
          scope.signOutText = scope.signOutText || 'Sign Out';
          scope.providerId = scope.providerId || '';
          scope.authorizationUrl = scope.authorizationUrl || '';
          scope.signOutRedirectUrl = scope.signOutRedirectUrl || '/login';

          compileTemplate();

//          scope.signedIn = accessToken.set() !== null;
        }

        scope.$watch('clientId', function() { init(); }); // on resolved


        scope.signIn = function() {
          AuthService.service.init(scope);
          AuthService.service.authorize();
        };
      };

      return definition;
    }]);


// Open ID directive
app.directive('authNavButton',
  ['AuthService',
    function(AuthService) {
      var definition = {
        restrict: 'E',
        templateUrl: 'views/templates/auth-nav-button.html',
        replace: true
      };

      definition.link = function(scope, element) {
        function compileTemplate() {
          $http.get(scope.template, { cache: $templateCache }).then(function(response) {
            element.html(response.data);
            $compile(element.contents())(scope);
          });
        }

        function init() {
          scope.template = scope.template || 'views/templates/social-media-button.html';
          scope.buttonClass = scope.buttonClass || 'btn btn-primary';
          scope.buttonIconClass = scope.buttonIconClass || 'glyphicon glyphicon-log-in';
          scope.signInText = scope.signInText || 'Sign In';
          scope.signOutText = scope.signOutText || 'Sign Out';
          scope.providerId = scope.providerId || '';
          scope.authorizationUrl = scope.authorizationUrl || '';
          scope.signOutRedirectUrl = scope.signOutRedirectUrl || '/login';

          compileTemplate();

//          scope.signedIn = accessToken.set() !== null;
        }

        scope.$watch('clientId', function() { init(); }); // on resolved


        scope.signIn = function() {
          AuthService.service.init(scope);
          AuthService.service.authorize();
        };
      };

      return definition;
    }]);
