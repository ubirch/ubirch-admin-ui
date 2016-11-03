'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.Device
 * @description
 * # Device
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('Device', ['$resource', 'constant', 'settings', '$log', 'uuid2', function ($resource, constant, settings, $log, uuid2) {

    var url = settings.UBIRCH_API_HOST + constant.AVATAR_SERVICE_REST_ENDPOINT;

    return {
      // http://localhost:8080/api/v1/avatarService/device
      device: $resource(url + '/device/:deviceId',
        {deviceId: '@deviceId'},
        {'update': {method: 'PUT', params:{deviceId: '@deviceId'}, isArray:false}}
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

      createDevice: function(device, callback){
        var deviceId = uuid2.newuuid();
        device.deviceId = deviceId;
        return this.device.save({}, device,
          function(data){
            $log.debug("Saved device with deviceId "+deviceId+": " + data);
            if (callback !== undefined){
              callback(data);
            }
          },
          function(error){
            $log.debug("Requested device data and config - ERROR OCCURRED: " + error);
          });

      },

      updateDevice: function(device, callback, error_callback){
        return this.device.update({deviceId: device.deviceId}, device,
          function(data){
            $log.debug("Successfully saved update of device: " + data);
            if (callback !== undefined){
              callback(data);
            }
          },
          function(error){
            $log.debug("Tried to save update of device - ERROR OCCURRED: " + error);
            if (error_callback !== undefined){
              error_callback(error);
            }
          });

      },

      getDevice: function(deviceId, callback, error_callback){
        return this.device.get({deviceId: deviceId},
          function(data){
            $log.debug("Got device data and config: " + data);
            if (callback !== undefined){
              callback(data);
            }
          },
          function(error){
            $log.debug("Requested device data and config - ERROR OCCURRED: " + error);
            if (error_callback !== undefined){
              error_callback(error);
            }
          });
      },

      deleteDevice: function(deviceId, callback, error_callback){
        return this.device.delete({deviceId: deviceId},
          function(data){
            $log.debug("Device deleted: " + data);
            if (callback !== undefined){
              callback(data);
            }
          },
          function(error){
            $log.debug("Tried to delete device - ERROR OCCURRED: " + error);
            if (error_callback !== undefined){
              error_callback(error);
            }
          });
      },

      deviceState: $resource(url + '/device/:deviceId/state',
        {deviceId: '@deviceId'}
      ),

      getDeviceState: function(deviceId, callback){
        return this.deviceState.get({deviceId: deviceId},
          function(data){
            $log.debug("Got device state: " + data);
            if (callback !== undefined){
              callback(data);
            }
          },
          function(error){
            $log.debug("Requested device state - ERROR OCCURRED: " + error);
          });

      },

      // http://localhost:8080/api/avatarService/v1/device/125555/history
      history: $resource(url + '/device/:deviceId/history',
                    {deviceId: '@deviceId'}
                  ),

      getHistory: function(deviceId /*, numOfMessages */){

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
