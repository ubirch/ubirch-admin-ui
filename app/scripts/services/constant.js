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
    // AvatarService
      AVATAR_SERVICE_REST_ENDPOINT : "/api/v1/avatarService",

    // device states
    ES_REST_ENDPOINT_URL : "https://kibana.ci.ubirch.com/",
    UBIRCH_INDEX : "ubirch-device-data",
    CREDENTIALS : "YmVhdGVmaXNzOnZpcnR1b3NvLXNjaGlzbS1zaHV0b3V0LWRlbWVzbmUtemVzdA==",
    TODAY: undefined
  });
