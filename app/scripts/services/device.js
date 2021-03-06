'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.Device
 * @description
 * # Device
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('Device', ['$resource', 'constants', 'settings', '$log', 'uuid2', 'moment', function ($resource, constants, settings, $log, uuid2, moment) {

    var url = settings.UBIRCH_API_HOST + constants.AVATAR_SERVICE_REST_ENDPOINT;

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

      createDevice: function(device, callback, errorCallback){
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
            if (errorCallback !== undefined){
              errorCallback(error);
            }
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

      getDeviceState: function(deviceId, callback, error_callback){
        return this.deviceState.get({deviceId: deviceId},
          function(data){
            $log.debug("Got device state: " + data);
            if (callback !== undefined){
              callback(data);
            }
          },
          function(error){
            if (error_callback !== undefined){
              error_callback(error);
            }
            else {
              $log.debug("Requested device state - ERROR OCCURRED: " + error);
            }
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

      // http://localhost:8080/api/avatarService/v1/device/e4ec8e2b-96e0-4611-bf66-9df6031af8f5/data/history/byDate/from/2017-02-24T00:00:00.000Z/to/2017-02-28T00:00:00.000Z
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

      /**
       *
       * @param deviceId id of device to get history from
       * @param from
       * @param size
       * @param callback
       * @param errorCallBack
       */
      getHistoryOfRange: function(deviceId, from, size, callback, errorCallBack){

        return this.history_of_data_range.query({deviceId: deviceId, from: from, size: size},
          function(data){
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

      getHistoryOfDateRange: function(deviceId, from_date, to_date, ignoreTime, callback, errorCallBack){
        if (!from_date || !to_date){
          errorCallBack("No date range defined");
          return null;
        }

        var from = moment(from_date, 'llll');
        var to = moment(to_date, 'llll');

        if (from.isAfter(to)){
          var temp = from;
          from = to;
          to = temp;
          console.warn("From date is after to date; used in reverse order!");

        }
        if (ignoreTime){
          from.startOf('day');
          to.endOf('day');
        }

        return this.history_of_date_range.query({deviceId: deviceId, from: from.toISOString(), to: to.toISOString()},
          function(data){
            if (callback){
              callback(data);
            }
          },
          function(error){
            $log.debug("Requested history from Device - ERROR OCCURRED: " + error);
            if (errorCallBack){
              errorCallBack(error);
            }
          }
        );
      },

      initDevice: function() {
        return {
          properties: [],
          config: [],
          tags: []
        };
      },

      addProperties: function(device, addedProperties){

        var addKeyValueTo = function(listName, addToList) {
          listName.forEach( function(item) {
            if (device[addToList] === undefined){
              device[addToList] = {};
            }
            if (item.key.length > 0 && item.value.length > 0){
              // check type of new value
              var val = item.value;
              if (!isNaN(item.value) && angular.isNumber(+item.value)){
                val = parseFloat(item.value);
              }
              else if (item.value.toUpperCase() === "TRUE"){
                val = true;
              }
              else if (item.value.toUpperCase() === "FALSE"){
                val = false;
              }

              device[addToList][item.key] = val;
            }
          });
        };

        addKeyValueTo(addedProperties.properties, "deviceProperties");
        addKeyValueTo(addedProperties.config, "deviceConfig");


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
