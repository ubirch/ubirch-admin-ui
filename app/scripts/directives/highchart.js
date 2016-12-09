'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:highchart
 * @description
 * # highchart
 */
angular.module('ubirchAdminCrudApp')
  .directive('hcChart', ['DeviceTypes', '$filter', function (DeviceTypes, $filter) {
    return {
      template: '<div id="hc_container"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        messages: '='
      },
      link: function (scope, element) {

        var filteredData = filterMessageKeys();

        var series = formatSeriesData(filteredData);


        // var convertDateToUTC = function(date) {
        //   return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        // };
        var lastDisplayedDay;

        Highcharts.dateFormats = {
          O: function (timestamp) {
            var date = new Date(timestamp),
              currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            if (lastDisplayedDay !== undefined && lastDisplayedDay.getTime() === currentDay.getTime()){
              return "";
            }
            else {
              var returnStr = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
              lastDisplayedDay = currentDay;
              return returnStr;
            }
          }
        };

        new Highcharts.chart(element[0], {
          chart: {
            type: 'line'
          },
          title: {
            text: 'Sensor data'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            title: {
              text: 'Date'
            },
            type: 'datetime',
            startOnTick: true,
            labels: {
              format: '{value:%O %H:%M:%S}',
              align: 'right',
              rotation: -30
            }

          },
          series: series
        });

        function filterMessageKeys() {

          var deviceTypes = DeviceTypes.getDeviceTypeList();
          var deviceType;

          var seriesData = {};

          // filter value
          scope.messages.forEach(function (message) {

            var timestamp = Date.parse(message.timestamp);
            // filter deviceType if not the same as the last message came from
            if (deviceType === undefined || (deviceType != undefined && deviceType.key !== message.deviceType)) {
              deviceType = $filter('getDeviceType')(deviceTypes, message.deviceType);
            }

            Object.keys(message.deviceMessage).forEach(function (key) {

              // if displayKeys are defined for this deviceType filter these keys from message properties
              if (deviceType && deviceType.displayKeys) {
                if (deviceType.displayKeys.indexOf(key) !== -1) {
                  addValue(seriesData, key, message.deviceMessage[key], timestamp);
                }
              }
              // if no displayKeys are defined for this deviceType display all message properties that are numerical
              else if (typeof message.deviceMessage[key] === "number") {
                addValue(seriesData, key, message.deviceMessage[key], timestamp);
              }

            });
          });

          return seriesData;
        }

        function formatSeriesData(seriesData){

          // format for highcharts
          var series = [], i = 0;

          Object.keys(seriesData).forEach(function(key){
            series[i] = {};
            series[i].data = seriesData[key];
            series[i].name = key;
            i++;
          });

          return series;

        }

        function addValue(seriesData, key, value, timestamp){
          if (seriesData[key] === undefined){
            seriesData[key] = [];
          }
          // seriesData[key].push([ timestamp, value]);
          seriesData[key].unshift([ timestamp, value]);
        }
      }
    };
  }]);
