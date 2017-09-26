/**
 * Created by ate on 27.09.16.
 */
angular.module('ubirchAdminCrudApp')
  .constant('settings', {
    CONTEXT: "ubirch-local",
    APP_ID: "admin-ui",
    UBIRCH_API_HOST : "https://api.ubirch.dev.ubirch.com",
    UBIRCH_AUTH_SERVICE_API_HOST : "https://auth.dev.ubirch.com",
    UBIRCH_USER_SERVICE_API_HOST : "https://auth.dev.ubirch.com",
    UBIRCH_KEY_SERVICE_API_HOST : "https://key.dev.ubirch.com",
    DEFAULT_DEVICE_TYPE_KEY: "unknownDeviceType",
    DEFAULT_AUTH_EXPIRED_SECS: -1,   // if OP didn't deliver expires_in parameter this is the default number of seconds after which authentication expires; set to -1 if token never expires in this case
    MQTT_SERVER: {
      HOST: "localhost",
      PORT: "1883"
    },
    ENV_ID: "local-dev",
    KEY_GENERATION_FOR_DEVICE_TYPES: ["calliopeMini"]
  });
