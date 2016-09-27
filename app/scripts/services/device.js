'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.Device
 * @description
 * # Device
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('Device', ['$resource', 'constant', 'settings', '$log', function ($resource, constant, settings, $log) {

    var es_url = constant.ES_REST_ENDPOINT_URL + constant.UBIRCH_INDEX;
    var url = settings.UBIRCH_API_HOST + constant.AVATAR_SERVICE_REST_ENDPOINT;

    return {
      // http://localhost:8080/api/v1/avatarService/device
      deviceState: $resource(url + '/device/:deviceId',
        {deviceId: '@deviceId'}
      ),

      getDevicesList: function(){
        return this.deviceState.query(
          function(data){
            $log.debug("Got devices list data: " + data);
          },
          function(error){
            $log.debug("Requested list of devices - ERROR OCCURRED: " + error);
          });
      },

      getDevice: function(deviceId, callback){
        return this.deviceState.get({deviceId: deviceId},
          function(data){
            $log.debug("Got device state and config: " + data);
            callback(data);
          },
          function(error){
            $log.debug("Requested device state and config - ERROR OCCURRED: " + error);
          });

      },

      // http://search-ubirch-device-data-3bfmzb4qqzvbj6cwxvhxwnol6y.us-east-1.es.amazonaws.com/ubirch-device-data/d65f1582-5cd2-4f8c-8607-922ecc2b4b45/_search
      history: $resource(es_url + '/:deviceId' + '/_search',
                    {deviceId: '@deviceId'},
                    {
                      'save': {
                        method: 'GET',
                        headers: {'Authorization': 'Basic ' + constant.CREDENTIALS} //    $http.defaults.headers.common.Authorization = 'Basic ' + 'beatefiss:virtuoso-schism-shutout-demesne-zest';
                      }
                    }
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
            $log.debug("Got history data from Device: " + data);
          },
          function(error){
            $log.debug("Requested history from Device - ERROR OCCURRED: " + error);
          });
      }
    };
  }]);
