/**
 * Created by ate on 27.09.16.
 */
angular.module('ubirchAdminCrudApp')
  .constant('settings', {
    UBIRCH_API_HOST : "http://localhost:8080",
    UBIRCH_AUTH_SERVICE_API_HOST : "http://localhost:8091",
    DEFAULT_DEVICE_TYPE_KEY: "unknownDeviceType"
  });
