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

      // http://localhost:8080/api/v1/avatarService/device/stub
      deviceStub: $resource(url + '/device/stub/:deviceId',
        {deviceId: '@deviceId'}
      ),

      getDevicesList: function(callback){
        return this.deviceStub.query(
          function(data){
            $log.debug("Got devices list data: " + data);
            if (callback !== undefined){
              callback(data);
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

      // http://localhost:8080/api/avatarService/v1/device/85281602-0a46-424b-be96-e3d88a3c91cc/data/history
      history: $resource(url + '/device/:deviceId/data/history',
                    {deviceId: '@deviceId'}
                  ),

      getHistory: function(deviceId /*, numOfMessages */){

        return this.history.query({deviceId: deviceId},
          function(data){
            $log.debug("Got history data from Device: " + data);
          },
          function(error){
            $log.debug("Requested history from Device - ERROR OCCURRED: " + error);
          });
      },

      initDevice: function() {
        return {
          properties: [],
          config: [],
          tags: []
        };
      },

      addProperties: function(device, addedProperties){

        addedProperties.properties.forEach( function(property) {
          if (property.key.length > 0 && property.value.length > 0){
            if (device.deviceProperties === undefined){
              device.deviceProperties = {};
            }
            device.deviceProperties[property.key] = property.value;
          }
        });
        addedProperties.config.forEach( function(config) {
          if (device.deviceConfig === undefined){
            device.deviceConfig = {};
          }
          if (config.key.length > 0 && config.value.length > 0){
            device.deviceConfig[config.key] = config.value;
          }
        });
        addedProperties.tags.forEach( function(tag) {
          if (device.tags === undefined){
            device.tags = [];
          }
          if (tag.value.length > 0 && device.tags.indexOf(tag.value) === -1){
            device.tags.push(tag.value);
          }
        });

        return device;
      }
    };
  }]);
