'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.constants
 * @description
 * # constants
 * Constants in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .constant('constants', {
    // ChainService
    CHAIN_SERVICE_REST_ENDPOINT : "/api/v1/chainService/explorer",
    // AvatarService
    AVATAR_SERVICE_REST_ENDPOINT : "/api/avatarService/v1",
    AVATAR_SERVICE_DOCUMENTATION : "http://developer.ubirch.com/docs/api/swagger-ui.html?url=https://raw.githubusercontent.com/ubirch/ubirchApiDocs/master/swaggerDocs//ubirch/avatar_service/1.0/ubirch_avatar_service_api.yaml",
    // AuthService
    AUTH_SERVICE_REST_ENDPOINT : "/api/authService/v1",
    // UserService
    USER_SERVICE_REST_ENDPOINT : "/api/authService/v1",

    POLLING_INTERVAL : 3000,
    DEFAULT_DEVICE_TYPE_KEY: "unknownDeviceTypeKey",
    INTIAL_GROUP_NAME: "my-ubirch-group",
    TODAY: undefined
  });
