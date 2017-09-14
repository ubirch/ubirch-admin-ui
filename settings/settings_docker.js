/**
 * Created by ate on 27.09.16.
 */
angular.module('ubirchAdminCrudApp')
  .constant('settings', {
    CONTEXT: "@@UBIRCH_OIDC_CONTEXT@@",
    APP_ID: "admin-ui",
    UBIRCH_API_HOST : "@@UBIRCH_API_HOST@@",
    UBIRCH_AUTH_SERVICE_API_HOST: "@@UBIRCH_AUTH_SERVICE_API_HOST@@",
    UBIRCH_USER_SERVICE_API_HOST: "@@UBIRCH_AUTH_SERVICE_API_HOST@@",
    DEFAULT_AUTH_EXPIRED_SECS: -1,
    DEFAULT_DEVICE_TYPE_KEY: "unknownDeviceType",
    MQTT_SERVER: {
      HOST: "@@MQTT_HOST@@",
      PORT: "@@MQTT_PORT@@"
    },
    ENV_ID: "@@ENVID@@"
  });
