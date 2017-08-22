'use strict';

/**
 * @ngdoc service
 * @name ubirchAuth.authService
 * @description
 * # authService
 * Service for ubirch authentication over openid connect
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

  var openIDConnectHashParams = ['providerId', 'code', 'state', 'provider', 'session_state', 'access_token', 'token_type', 'expires_in', 'scope', 'nonce', 'authuser', 'error', 'error_description'];
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
    this.token = token;

    if (token !== null) {
      $sessionStorage.token = null;
      delete $sessionStorage.token;
    }

    return token;
  };

  /**
   * add param to token; creates an empty token if neccessary
   * @returns token
   */
  service.addTokenParam = function(param, value) {
    if (!this.token){
      this.token = {};
    }
    this.token[param] = value;

    return this.token;
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

app.service('AuthService', ['$resource', 'constants', 'settings', '$rootScope', '$location', 'AccessToken', 'UserService',
  function ($resource, constants, settings, $rootScope, $location, AccessToken, UserService) {

  var url = settings.UBIRCH_AUTH_SERVICE_API_HOST + constants.AUTH_SERVICE_REST_ENDPOINT;

  var service = {
    // http://localhost:8091/api/loginService/v1/providerInfo/list/trackle-dev
    providerInfo: $resource(url + '/providerInfo/list/' + settings.CONTEXT + "/" + settings.APP_ID),

    verifyAuth: $resource(url + '/verify/code'),

    // http://localhost:8091/api/authService/v1/logout/$TOKEN
    logout: $resource(url + '/logout/:token',
      {token: '@token'}
    ),

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
    setRegistrationFlag: function(value) {
      UserService.setRegistrationFlag(value);
    },
    authorize: function () {
      if (this.authorizationUrl && this.authorizationUrl.length > 0) {
        window.location.replace(this.authorizationUrl);
      }
    },
    authenticationRequired: function() {
      var token = AccessToken.getTokenFromSession();
      var signedIn = token != null && !AccessToken.expired(token);
      $rootScope.signedIn = signedIn;
      return !signedIn;
    },
    signOut: function () {
      var token = AccessToken.getTokenFromSession();
      if (token && token.providerId) {

        var self = this;

        this.logout.get({token: token.token},
          function () {
            AccessToken.destroy();
            UserService.destroy();
            $rootScope.$broadcast("auth:signedOut", "You have been logged out");
            $location.url(self.signOutRedirectUrl);
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
            var providerId = query.providerId || AccessToken.getFromSession("providerId");
            AccessToken.addTokenParam("providerId", providerId);

            if (query.code && query.state && providerId) {

              // check agains authService
              this.verifyAuth.save(
                {
                  "context": settings.CONTEXT,
                  "appId": settings.APP_ID,
                  "providerId": providerId,
                  "code": query.code,
                  "state": query.state
                },
                function (data) {
                  if (data.token) {
                    var token = AccessToken.addTokenParam("token", data.token);
                    AccessToken.saveTokenInSession(token);
                    UserService.getAccount().$promise
                      .then(
                        function(account){
                          if (account !== undefined){
                            // found user registered for token

                            if (UserService.isRegistrationFlagSet()) {
                              // user tried to register again
                              $rootScope.$broadcast('auth:alreadyRegisteredLogin', account);
                            }
                            else {
                              // enter app
                              $rootScope.signedIn = true;
                              $rootScope.$broadcast('auth:loggedIn', account);
                            }
                          }
                          else {
                            handleError("accountNotAccessibleError", "Something went wrong while accessing account");
                          }
                        },
                        function(error) {
                          // check error type
                          switch (error.status) {
                            case "400":
                              if (error.data.errorType === "NoUserInfoFound"){
                                // no user registered for token

                                if (UserService.isRegistrationFlagSet()) {
                                  service.register();
                                }
                                else {
                                  $rootScope.$broadcast('auth:registrationRequired', data.token);
                                }
                              }
                              break;
                            case "403":
                              $rootScope.$broadcast('auth:authRequired', 'You need to login');
                              break;
                            default:
                              handleError("accountNotAccessibleError", "Something went wrong while accessing account");
                          }
                        }
                      );
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
            $rootScope.$broadcast('auth:verified', 'You are logged in successfully');
          }
        }
        else {
          $rootScope.$broadcast('auth:authRequired', 'You need to login');
        }
      }
    },
    register: function () {
      UserService.register.save(
        function (account) {
          if (account !== undefined){
            UserService.setAccount(account);
            // enter app
            $rootScope.signedIn = true;
            $rootScope.$broadcast('auth:loggedIn');
          }
          else {
            handleError("accountNotAccessibleError", "Something went wrong while accessing account");
          }
        },
        function (error) {
          // something went wrong
          handleError(error.errorId, error.errorMessage);
        }
      );
    }
  };

  var handleError = function(errorType, errorMessage) {

    switch (errorType){
      case "LogoutFailedError":
        // user is still logged in
        $rootScope.$broadcast('auth:verified', errorMessage);
        break;
      case "authWarning":
        $rootScope.$broadcast('auth:authWarning', errorMessage);
        break;
      case "accountNotAccessibleError":
        // broadcast error
        $rootScope.$broadcast('auth:authError', errorType + ": " + errorMessage);
        break;
      default:
        // remove sessionToken
        AccessToken.destroy();
        UserService.destroy();
        // broadcast error
        $rootScope.$broadcast('auth:authError', errorType + ": " + errorMessage);
    }
  };

  return service;

}]);

app.factory('OAuth2Interceptor', ['$q', '$sessionStorage', '$location', 'AccessToken', function ($q, $sessionStorage, $location, AccessToken) {

  var service = {
    request: function(config) {
      var token = $sessionStorage.token;
      if (token && !AccessToken.expired(token)) {
        // send auth service token to app
         config.headers.Authorization = 'Bearer ' + token.token;
        return config;
      }
      return config;
    },

    responseError: function (rejection) {//error
      console.log('Failed with', rejection.status, 'status');
      switch (rejection.status) {
        case 401:
        case 403:
          if (rejection.config.url.includes("avatarService")){
            $location.url('/login');
          }
          break;
        case 405:
          break;
      }
      return $q.reject(rejection);
    }

  };
  return service;
}]);

// Open ID directive
app.directive('authButton',
  ['AuthService',
    function(AuthService) {
      var definition = {
        templateUrl: 'views/templates/social-media-button.html',
        restrict: 'E',
        replace: true,
        scope: {
          template: '@',					// template for the button, defaults to the one supplied by bower
          buttonClass: '@',				// the class to use for the sign in / out button - defaults to btn btn-primary
          buttonIconClass: '@',   // the ionicons, fontawesome or glyphicons class to add icon to button - dafaults to glyphicon glyphicon-log-in
          signInText: '@',				// text for the sign in button
          providerId: '@',        // id of openid connect provider
          authorizationUrl: '@',  // authorization server url
          registration: '@'       // if set to true this is handled as an explicit registration button - default to false = login button
        }
      };

      definition.link = function(scope) {
        function init() {
          scope.buttonClass = scope.buttonClass || 'btn btn-primary';
          scope.buttonIconClass = scope.buttonIconClass || 'glyphicon glyphicon-log-in';
          scope.signInText = scope.signInText || 'Sign In';
          scope.providerId = scope.providerId || '';
          scope.authorizationUrl = scope.authorizationUrl || '';
          if (scope.registration !== undefined && scope.registration){
            AuthService.setRegistrationFlag(true);
          }
          else {
            AuthService.setRegistrationFlag(false);
          }
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
        loginUrl: '@',          // path to the login page - mandatory
        registerUrl: '@',       // path to the registration page
                                // - optional; if not specified no registration button will be displayed
        loginText: '@',         // text for the login button
        registerText: '@',      // text for the registration button
        logoutText: '@',        // text for the logout button
        signOutRedirectUrl: '@' // redirect url after locally deleting token to logout user (leave user logged in against OP)
                                // - optional; otherwise loginUrl is used
      },
      link: function postLink(scope) {

        scope.loginText = scope.loginText || 'login';
        scope.registerText = scope.registerText || 'register';
        scope.logoutText = scope.logoutText || 'logout';

        var authServiceParams = {
          signOutRedirectUrl: scope.signOutRedirectUrl || scope.loginUrl
        };

        AuthService.init(authServiceParams);

        scope.login = function() {
          $location.url(scope.loginUrl);
        };

        scope.register = function() {
          $location.url(scope.registerUrl);
        };

        scope.logout = function() {
          // remove token from AccessToken service and sessionStorage
          AuthService.signOut();
        };

        if ($rootScope.signedIn === undefined){
          $rootScope.signedIn = false;
        }
        scope.$on('auth:authError', function () { $rootScope.signedIn = false; });
        scope.$on('auth:authExpired', function () { $rootScope.signedIn = false; });
        scope.$on('auth:authRequired', function () { $rootScope.signedIn = false; });
        scope.$on('auth:signedOut', function () { $rootScope.signedIn = false; });
        scope.$on('auth:verified', function () { $rootScope.signedIn = true; });

      }
    };
  }]);
