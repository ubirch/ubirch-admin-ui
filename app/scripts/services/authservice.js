'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.authService
 * @description
 * # authService
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('AuthService', ['$resource', 'constant', 'settings', '$log', function ($resource, constant, settings, $log) {

    var url = settings.UBIRCH_AUTH_SERVICE_API_HOST + constant.AUTH_SERVICE_REST_ENDPOINT;

    return {
      // http://localhost:8091/api/loginService/v1/providerInfo/list
      providerInfo: $resource(url + '/providerInfo/list')
    }
  }]);
