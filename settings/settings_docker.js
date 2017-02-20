/**
 * Created by ate on 27.09.16.
 */
angular.module('ubirchAdminCrudApp')
  .constant('settings', {
    UBIRCH_API_HOST : "http://52.166.200.188:8080/",
    UBIRCH_AUTH_SERVICE_API_HOST : "${UBIRCH_AUTH_SERVICE_API_HOST}",
    DEFAULT_AUTH_EXPIRED_SECS: -1,
    DEFAULT_DEVICE_TYPE_KEY: "unknownDeviceType"
  });
