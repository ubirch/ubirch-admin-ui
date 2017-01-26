'use strict';

/**
 * @ngdoc service
 * @name angularJsApp.loginInterceptor
 * @description
 * # loginInterceptor
 * Service in the angularJsApp.
 */
angular.module('ubirchAdminCrudApp')
  .factory('loginInterceptor', ['$rootScope', '$q', '$location', function(scope, $q, $location) {
      var interceptor = {
        request: function (config) {//req
          console.log(config);
          return config;
        },

        response: function (result) {//res
          console.log('Repos:');
          console.log(result.status);
          return result;
        },

        responseError: function (rejection) {//error
          console.log('Failed with', rejection.status, 'status');
          if (rejection.status === 403) {
            $location.url('/login');
          }

          return $q.reject(rejection);
        }


      };

      return interceptor;
  }]);
