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
    REST_ENDPOINT_URL : "https://kibana.ci.ubirch.com/",
    UBIRCH_INDEX : "ubirch-device-data"
  });
