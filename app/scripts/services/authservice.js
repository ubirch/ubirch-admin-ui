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

  /**
   *   if OAuth query contains expires_in OR settings.DEFAULT_AUTH_EXPIRED_SECS is set the token.expires_at date-time will be set
   */
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

  var openIDConnectHashParams = ['code', 'state', 'provider', 'session_state', 'access_token', 'token_type', 'expires_in', 'scope', 'nonce', 'authuser', 'error', 'error_description'];
  /**
   *
   * @param hash: query string from request
   * @returns token with found params, defined in openIDConnectHashParams
   */
  service.getTokenFromHashParams = function(hash) {
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
  };

  /**
   * calls getTokenFromHashParams to fetch params from query and stores token in AccessToken service
   * AND removes token from sessionStorage
   * @param hash: query string from request
   * @returns token with found params, defined in openIDConnectHashParams
   */
  service.setTokenFromHashParams = function(hash) {
    var token = this.getTokenFromHashParams(hash);
    if (token !== null) {
      $sessionStorage.token = null;
      delete $sessionStorage.token;
    }
    return token;
  };

  /**
   * check code and state of the sent data to be the same as stored token
   * @param token to be checked
   * @returns {boolean} true if code and state of the sent data are correct
   */
  service.check = function(token) {
    // TODO: check code and state of the sent data to be the same as stored token
    return true;
  };

  /**
   * stores token in sessionStorage
   * @param token to be stored
   */
  service.saveTokenInSession = function(token) {
    $sessionStorage.token = token;
  };

  /**
   * stores token in sessionStorage
   * @param token to be stored
   */
  service.getTokenFromSession = function() {
    return $sessionStorage.token ? $sessionStorage.token : null;
  };


  /**
   * @returns stored token
   */
  service.get = function() {
    return this.token;
  };

  /**
   * stores token in AccessToken service
   */
  service.set = function(token) {
    service.token = token;
  };

  service.storeInSession = function(key, value){

    if (!$sessionStorage.authServiceProps) {
      $sessionStorage.authServiceProps = {};
    }
    $sessionStorage.authServiceProps[key] = value;
  };

  service.getFromSession = function(key){
    if (!$sessionStorage.authServiceProps){
      return undefined;
    }
    return $sessionStorage.authServiceProps[key];
  };

  /**
   *
   * @param token
   * @returns {boolean} if token is expired
   */
  service.expired = function(token) {
    return (token && token.expires_at && new Date(token.expires_at) < new Date());
  };

  /**
   * removes token and providerId from service and sessionStorage
   */
  service.destroy = function() {
    $sessionStorage.token = null;
    $sessionStorage.providerId = null;
    delete $sessionStorage.token;
    delete $sessionStorage.providerId;
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

    // http://localhost:8091/api/authService/v1/logout POST
    logout: $resource(url + '/logout'),

    authorizationUrl: "",
    signOutRedirectUrl: "",
    init: function (params) {
      if (params.authorizationUrl) {
        this.authorizationUrl = params.authorizationUrl;
      }
      if (params.signOutRedirectUrl) {
        this.signOutRedirectUrl = params.signOutRedirectUrl;
      }
      if (params.providerId) {
        // store providerId in SessionStorage
        AccessToken.storeInSession("providerId", params.providerId);
      }
    },
    authorize: function () {
      if (this.authorizationUrl && this.authorizationUrl.length > 0) {
        window.location.replace(this.authorizationUrl);
      }
    },
    signOut: function () {
      var token = AccessToken.get();
      if (token && token.providerId) {

        this.logout.save(
          {
            "providerId": token.providerId,
            "token": token
          },
          function () {
            AccessToken.destroy();
            $rootScope.$broadcast("auth:signedOut", "You have been logged out");
            $location.url(this.signOutRedirectUrl);
          },
          function () {
            handleError("LogoutFailedError", "Something went wrong, you cannot be logged out");
          }
        )
      }
      else {
        handleError("LogoutFailedError", "Something went wrong, you cannot be logged out");
      }
    },

    verify: function () {

      // check if query params added in request
      var hashValues = window.location.hash;
      var queryStart = hashValues.length > 0 ? hashValues.indexOf("?") : -1;
      if (queryStart >= 0) {

        var queryStr = hashValues.substr(hashValues.indexOf("?") + 1);
        var query = AccessToken.setTokenFromHashParams(queryStr);

        if (query) {
          if (query.error) {
            // handle authentication error
            handleError(query.error, query.error_description);
          }
          else {
            var providerId = query.provider || AccessToken.getFromSession("providerId");
            if (query.code && query.state && providerId) {
              // check agains authService

              this.verifyAuth.save(
                {
                  "providerId": providerId,
                  "code": query.code,
                  "state": query.state
                },
                function (data) {
                  if (AccessToken.check(data)) {
                    var token = AccessToken.get();
                    AccessToken.saveTokenInSession(token);
                    $rootScope.$broadcast('auth:verified', token);
                  }
                  else {
                    handleError("InconsistentCodeStateError", "Something went wrong with your authentication (code and/or state not the same as sended - probably a manInTheMiddle");
                  }
                },
                function (error) {
                  // handle authentication error
                  handleError(error.data.errorType, error.data.errorMessage);
                }
              )
            }
          }
        }
        else {
          $rootScope.$broadcast('auth:authError', "Authentication token from OpenId Connect provider didn't contain code and/or state parameter.");
        }
      }
      else {
        // no query
        var sessionToken = AccessToken.getTokenFromSession();
        if (sessionToken) {
          if (AccessToken.expired(sessionToken)) {
            $rootScope.$broadcast('auth:authExpired', 'Your authentication token has expired. You need a new one. Please login again!');
          }
          else {
            AccessToken.set(sessionToken);
            $rootScope.$broadcast('auth:verified', token);
          }
        }
        else {
          $rootScope.$broadcast('auth:authRequired', 'You need to login');
        }
      }
    }
  };

  var handleError = function(errorType, errorMessage) {
    // remove sessionToken
    AccessToken.destroy();
    // broadcast error
    $rootScope.$broadcast('auth:authError', errorType + ": " + errorMessage);
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
      else if (rejection.status === 403) {
        // TODO: separate page for forbidden requests
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

          providerId: '@',        // id of openid connect provider
          authorizationUrl: '@'  // authorization server url
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
          scope.providerId = scope.providerId || '';
          scope.authorizationUrl = scope.authorizationUrl || '';

          compileTemplate();

//          scope.signedIn = accessToken.set() !== null;
        }

        scope.$watch('authorizationUrl', function() { init(); }); // on resolved


        scope.signIn = function() {
          AuthService.init(scope);
          AuthService.authorize();
        };
      };

      return definition;
    }]);


// Open ID directive
app.directive('authNavButton',
  ['$location', 'AuthService', '$rootScope', function($location, AuthService, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'views/templates/auth-nav-button.html',
      replace: true,
      scope: {
        loginUrl: '@',           // path to the login page - mandatory
        loginText: '@',          // text for the login button
        logoutText: '@',         //  text for the logout button
        signOutRedirectUrl: '@'  // redirect url after locally deleting token to logout user (leave user logged in against OP) - optional; otherwise loginUrl is used
      },
      link: function postLink(scope) {

        scope.loginText = scope.loginText || 'login';
        scope.logoutText = scope.logoutText || 'logout';

        var authServiceParams = {
          logoutUrl: scope.signOutRedirectUrl || scope.loginUrl
        };

        AuthService.init(authServiceParams);

        scope.login = function() {
          $location.url(scope.loginUrl);
        };

        scope.logout = function() {
          // remove token from AccessToken service and sessionStorage
          AuthService.signOut();
        };

        $rootScope.signedIn = false;
        scope.$on('auth:authError', function () { $rootScope.signedIn = false; });
        scope.$on('auth:authExpired', function () { $rootScope.signedIn = false; });
        scope.$on('auth:authRequired', function () { $rootScope.signedIn = false; });
        scope.$on('auth:signedOut', function () { $rootScope.signedIn = false; });
        scope.$on('auth:verified', function () { $rootScope.signedIn = true; });

      }
    };
  }]);
