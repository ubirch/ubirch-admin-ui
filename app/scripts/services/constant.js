'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.constant
 * @description
 * # constant
 * Constant in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .constant('constant', {
    // ChainService
    CHAIN_SERVICE_REST_ENDPOINT : "/api/v1/chainService/explorer",
    // device states
    REST_ENDPOINT_URL : "https://kibana.ci.ubirch.com/",
    UBIRCH_INDEX : "ubirch-device-data",
    CREDENTIALS : "YmVhdGVmaXNzOnZpcnR1b3NvLXNjaGlzbS1zaHV0b3V0LWRlbWVzbmUtemVzdA==",
    TODAY: undefined
  })
  .constant('settings', {
    CHAIN_SERVICE_HOST : "http://localhost:8080"
  });
