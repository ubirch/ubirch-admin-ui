'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.DeviceMessage
 * @description
 * # DeviceMessage
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('DeviceMessage', ['$resource', 'constant', '$log', '$http', function ($resource, constant, $log, $http) {

    var url = constant.REST_ENDPOINT_URL + constant.UBIRCH_INDEX;

//    $http.defaults.headers.common.Authorization = 'Basic ' + 'beatefiss:virtuoso-schism-shutout-demesne-zest';
    $http.defaults.headers.common.Authorization = 'Basic ' + constant.CREDENTIALS;

    return {
      // http://search-ubirch-device-data-3bfmzb4qqzvbj6cwxvhxwnol6y.us-east-1.es.amazonaws.com/ubirch-device-data/d65f1582-5cd2-4f8c-8607-922ecc2b4b45/_search

      history: $resource(url + '/:deviceId' + '/_search',
                    {deviceId: '@deviceId'}
                ),

      getHistory: function(deviceId, numOfMessages){
        var query = {
          "sort" : [
            { "timestamp" : "desc" }
          ],
          "query": {
            "match_all": {}
          },
          "from" : 0,
          "size" : numOfMessages
        };

        return this.history.save(deviceId, query,
          function(data){
            $log.debug("Got history data from DeviceMessage: " + data);
          },
          function(error){
            $log.debug("Requested history from DeviceMessage - ERROR OCCURED: " + error);
          });
      }
    };
  }]);
