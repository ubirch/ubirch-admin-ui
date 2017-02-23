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
      AVATAR_SERVICE_REST_ENDPOINT : "/api/avatarService/v1",

    POLLING_INTERVAL : 3000,
    DEFAULT_DEVICE_TYPE_KEY: "unknownDeviceTypeKey",
    TODAY: undefined
  });
