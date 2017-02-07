'use strict';

// Move these to a directive
//var authorizationUrl = 'https://localhost:44313/identity/connect/authorize';
//var client_id = 'implicit';
//var redirect_uri = 'http://localhost:37045/';
//var response_type = "token";
//var scope = "extracurricular";
//var state = Date.now() + "" + Math.random();

angular.module('oauth2.accessToken', ['ngStorage']).factory('AccessToken', ['$rootScope', '$location', '$sessionStorage', function($rootScope, $location, $sessionStorage) {
  var service = {
    token: null
  };
  var oAuth2HashParams = ['code', 'access_token', 'token_type', 'expires_in', 'scope', 'state', 'session_state', 'nonce', 'authuser', 'error', 'error_description'];

  function setExpiresAt(token) {
    if(token){
      var expires_at = new Date();
      expires_at.setSeconds(expires_at.getSeconds()+parseInt(token.expires_in)-60); // 60 seconds less to secure browser and response latency
      token.expires_at = expires_at;
    }
  }

  function setTokenFromHashParams(hash) {
    var token = getTokenFromHashParams(hash);
    if (token !== null) {
      setExpiresAt(token);
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

      if (oAuth2HashParams.indexOf(param) >= 0) {
        token[param] = value;
      }
    }

    if(token.code || token.access_token || token.error){
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

    if (service.token === null) {
      service.token = $sessionStorage.token;
      if (service.token === undefined) {
        service.token = null;
      }
    }

    if (service.token && service.token.error) {
      var error = service.token.error;
      service.destroy();
      $rootScope.$broadcast('oauth2:authError', error);
    }

    if (service.token !== null && $sessionStorage.oauthRedirectRoute) {
      var path = $sessionStorage.oauthRedirectRoute;
      $sessionStorage.oauthRedirectRoute = null;
      $location.path(path);
    }

    return service.token;
  };
  service.destroy = function() {
    $sessionStorage.token = null;
    delete $sessionStorage.token;
    service.token = null;
  };

  return service;
}]);

// Auth interceptor - if token is missing or has expired this broadcasts an authRequired event
angular.module('oauth2.interceptor', []).factory('OAuth2Interceptor', ['$rootScope', '$q', '$sessionStorage', '$location', function ($rootScope, $q, $sessionStorage, $location) {
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

// Endpoint wrapper
angular.module('oauth2.endpoint', []).factory('Endpoint', ['AccessToken', function(accessToken) {
  var service = {
    authorize: function() { window.location.replace(service.url); },
    appendSignoutToken: false
  };

  service.signOut = function(token) {
    if (service.signOutUrl && service.signOutUrl.length > 0) {
      var url = service.signOutUrl;
      if (service.appendSignoutToken) {
        url = url + token;
      }
      window.location.replace(url);
    }
  };

  service.init = function(params) {
    service.url = params.authorizationUrl;
  };

  return service;
}]);

// Open ID directive
angular.module('oauth2.directive', []).directive('oauth2',
  ['$rootScope', '$http', '$location', '$templateCache', '$compile', '$sessionStorage', 'AccessToken', 'Endpoint',
    function($rootScope, $http, $location, $templateCache, $compile, $sessionStorage, accessToken, endpoint) {
      var definition = {
        restrict: 'E',
        replace: true,
        scope: {
          authorizationUrl: '@',          // authorization server url
          clientId: '@',       			// client ID
          redirectUrl: '@',   			// uri th auth server should redirect to (cannot contain #)
          responseType: '@',  			// defaults to token
          scope: '@',						// scopes required (not the Angular scope - the auth server scopes)
          state: '@',						// state to use for CSRF protection
          template: '@',					// template for the button, defaults to the one supplied by bower
          buttonClass: '@',				// the class to use for the sign in / out button - defaults to btn btn-primary
          buttonIconClass: '@',   // the ionicons, fontawesome or glyphicons class to add icon to button - dafaults to glyphicon glyphicon-log-in
          signInText: '@',				// text for the sign in button
          signOutText: '@',				// text for the sign out button
          signOutUrl: '@',				// url on the authorization server for logging out. Local token is deleted even if no URL is given but that will leave user logged in against STS
          signOutAppendToken: '@',		// defaults to 'false', set to 'true' to append the token to the sign out url
          signOutRedirectUrl: '@'			// url to redirect to after sign out on the STS has completed
        }
      };

      definition.link = function(scope, element, attrs) {
        function compile() {
          $http.get(scope.template, { cache: $templateCache }).then(function(response) {
            element.html(response.data);
            $compile(element.contents())(scope);
          });
        }

        function routeChangeHandler(event, nextRoute) {
          if (nextRoute.$$route && nextRoute.$$route.requireToken) {
            if (!accessToken.get()) {
              $sessionStorage.oauthRedirectRoute = nextRoute.$$route.originalPath;
              endpoint.authorize();
            }
          }
        }

        function init() {
          scope.template = scope.template || 'bower_components/angularjs-oauth2/dist/templates/angularJsOAuth2.html';
          scope.buttonClass = scope.buttonClass || 'btn btn-primary';
          scope.buttonIconClass = scope.buttonIconClass || 'glyphicon glyphicon-log-in';
          scope.signInText = scope.signInText || 'Sign In';
          scope.signOutText = scope.signOutText || 'Sign Out';
          scope.responseType = scope.responseType || 'token';
          scope.signOutUrl = scope.signOutUrl || '';
          scope.signOutRedirectUrl = scope.signOutRedirectUrl || '';
          scope.unauthorizedAccessUrl = scope.unauthorizedAccessUrl || '';

          compile();

          endpoint.init(scope);
          scope.signedIn = accessToken.set() !== null;
          scope.$on('oauth2:authRequired', function() {
            endpoint.authorize();
          });
          scope.$on('oauth2:authError', function() {
            if (scope.unauthorizedAccessUrl.length > 0) {
              $location.path(scope.unauthorizedAccessUrl);
            }
          });
          $rootScope.$on('$routeChangeStart', routeChangeHandler);
        }

        scope.$watch('clientId', function(value) { init(); });

        scope.signedIn = false;

        scope.signIn = function() {
          endpoint.authorize();
        };

        scope.signOut = function() {
          var token = accessToken.get().access_token;
          accessToken.destroy();
          endpoint.signOut(token);
        };
      };

      return definition;
    }]);
