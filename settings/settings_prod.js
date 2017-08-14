/**
 * Created by ate on 27.09.16.
 */
angular.module('ubirchAdminCrudApp')
  .constant('settings', {
    CONTEXT: "ubirch-prod",
    APP_ID: "admin-ui",
    UBIRCH_API_HOST : "http://ubirch.prod.ubirch.com:80",
    DEFAULT_DEVICE_TYPE_KEY: "unknownDeviceType",
    UBIRCH_AUTH_SERVICE_API_HOST : "http://auth.prod.ubirch.com:8091",
    UBIRCH_USER_SERVICE_API_HOST : "http://auth.prod.ubirch.com:8091",
    DEFAULT_AUTH_EXPIRED_SECS: -1   // if OP didn't deliver expires_in parameter this is the default number of seconds after which authentication expires; set to -1 if token never expires in this case
  });
