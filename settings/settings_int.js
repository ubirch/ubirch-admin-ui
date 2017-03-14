/**
 * Created by ate on 27.09.16.
 */
angular.module('ubirchAdminCrudApp')
  .constant('settings', {
    CONTEXT: "ubirch-admin-ui",
    UBIRCH_API_HOST : "https://dashboard.tools.ubirch.com",
    DEFAULT_DEVICE_TYPE_KEY: "unknownDeviceType",
    UBIRCH_AUTH_SERVICE_API_HOST : "https://dashboard.tools.ubirch.com",
    DEFAULT_AUTH_EXPIRED_SECS: -1   // if OP didn't deliver expires_in parameter this is the default number of seconds after which authentication expires; set to -1 if token never expires in this case
  });
