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
      device: $resource(url + '/device/:deviceId',
        {deviceId: '@deviceId'}
      ),

      getDevicesList: function(callback){
        return this.device.query(
          function(data){
            $log.debug("Got devices list data: " + data);
            if (callback !== undefined){
              callback();
            }
          },
          function(error){
            $log.debug("Requested list of devices - ERROR OCCURRED: " + error);
          });
      },

      getDevice: function(deviceId, callback){
        return this.device.get({deviceId: deviceId},
          function(data){
            $log.debug("Got device data and config: " + data);
            callback(data);
          },
          function(error){
            $log.debug("Requested device data and config - ERROR OCCURRED: " + error);
          });

      },

      deviceState: $resource(url + '/device/:deviceId/state',
        {deviceId: '@deviceId'}
      ),

      getDeviceState: function(deviceId, callback){
        return this.deviceState.get({deviceId: deviceId},
          function(data){
            $log.debug("Got device state: " + data);
            callback(data);
          },
          function(error){
            $log.debug("Requested device state - ERROR OCCURRED: " + error);
          });

      },

      // http://localhost:8080/api/avatarService/v1/device/125555/history
      history: $resource(url + '/device/:deviceId/history',
                    {deviceId: '@deviceId'}
                  ),

      getHistory: function(deviceId, numOfMessages){

        return this.history.get(deviceId,
          function(data){
            $log.debug("Got history data from Device: " + data);
          },
          function(error){
            $log.debug("Requested history from Device - ERROR OCCURRED: " + error);
          });
      }
    };
  }]);
