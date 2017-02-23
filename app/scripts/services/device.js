'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.Device
 * @description
 * # Device
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('Device', ['$resource', 'constant', 'settings', '$log', 'uuid2', '$filter', function ($resource, constant, settings, $log, uuid2, $filter) {

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

      // http://localhost:8080/api/avatarService/v1/device/85281602-0a46-424b-be96-e3d88a3c91cc/data/history/0/10
      history_of_data_range: $resource(url + '/device/:deviceId/data/history/:from/:size',
        {deviceId: '@deviceId', from: '@from', size: '@size'}
      ),

      // http://localhost:8080/api/avatarService/v1/device/7353a975-52fe-4c24-9efe-4dbf7178f66d/data/history/byDate/day/2017-02-21
      history_of_day: $resource(url + '/device/:deviceId/data/history/byDate/day/:date',
        {deviceId: '@deviceId', date: '@date'}
      ),

      // http://localhost:8080/api/avatarService/v1/device/7353a975-52fe-4c24-9efe-4dbf7178f66d/data/history/byDate/from/2017-02-15/to/2017-02-21
      history_of_date_range: $resource(url + '/device/:deviceId/data/history/byDate/from/:from/to/:to',
        {deviceId: '@deviceId', from: '@from', to: '@to'}
      ),

      getHistory: function(deviceId){

        return this.history.query({deviceId: deviceId},
          function(data){
            $log.debug("Got history data from Device: " + data);
          },
          function(error){
            $log.debug("Requested history from Device - ERROR OCCURRED: " + error);
          });
      },

      getHistoryOfRange: function(deviceId, from, size, callback, errorCallBack){

        return this.history_of_data_range.query({deviceId: deviceId, from: from, size: size},
          function(data){
            $log.debug("Got history data from Device: " + data);
            if (callback){
              callback(data);
            }
          },
          function(error){
            $log.debug("Requested history from Device - ERROR OCCURRED: " + error);
            if (errorCallBack){
              errorCallBack(error);
            }
          });
      },

      getHistoryOfDateRange: function(deviceId, from_date, to_date, callback, errorCallBack){
        if (!from_date || !to_date){
          errorCallBack("No date range defined");
          return null;
        }
        var from_iso = $filter('date')(from_date, "'yyyy-MM-dd");
        var to_iso = $filter('date')(to_date, "'yyyy-MM-dd");

        if (from_date < to_date){
          return this.history_of_date_range.query({deviceId: deviceId, from: from_iso, to: to_iso},
            function(data){
              $log.debug("Got history data from Device: " + data);
              if (callback){
                callback(data);
              }
            },
            function(error){
              $log.debug("Requested history from Device - ERROR OCCURRED: " + error);
              if (errorCallBack){
                errorCallBack(error);
              }
            });
        }
        else {
          return this.history_of_day.query({deviceId: deviceId, date: from_iso},
            function(data){
              $log.debug("Got history data from Device: " + data);
              if (callback){
                callback(data);
              }
            },
            function(error){
              $log.debug("Requested history from Device - ERROR OCCURRED: " + error);
              if (errorCallBack){
                errorCallBack(error);
              }
            });
        }
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
