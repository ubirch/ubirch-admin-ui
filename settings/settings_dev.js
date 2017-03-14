/**
 * Created by ate on 27.09.16.
 */
angular.module('ubirchAdminCrudApp')
  .constant('settings', {
    CONTEXT: "ubirch-admin-ui-dev",
    UBIRCH_API_HOST : "http://localhost:8080",
    UBIRCH_AUTH_SERVICE_API_HOST : "http://localhost:8091",
    DEFAULT_DEVICE_TYPE_KEY: "unknownDeviceType",
    DEFAULT_AUTH_EXPIRED_SECS: 60   // if OP didn't deliver expires_in parameter this is the default number of seconds after which authentication expires; set to -1 if token never expires in this case
  });
