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
        messages: '=',
        shownSeries: '=',
        separate: "="
      },
      link: function (scope, element) {

        var lastDisplayedDay;

        Highcharts.setOptions({                                            // This is for all plots, change Date axis to local timezone
          global : {
            useUTC : false
          }
        });

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

        scope.seriesColor = {};
        scope.yaxis = [];

        scope.$watch('messages', function(){
          var filteredData = filterMessageKeys();

          var series = formatSeriesData(filteredData);

          var options = {
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
            plotOptions: {
              series: {
                events: {
                  hide: function () {
                    scope.shownSeries[this.name] = false;
                  },
                  show: function () {
                    scope.shownSeries[this.name] = true;
                  }
                }
              }
            },
            series: series
          };
          if (scope.separate && scope.separate.yaxis === "all"){
            options.yAxis = scope.yaxis;
          }

          new Highcharts.chart(element[0], options);
        });

        function formatSerie(seriesData, key, deviceMessage, timestamp) {
          addValue(seriesData, key, deviceMessage, timestamp);
          // initially display every new series in chart
          if (scope.shownSeries[key] === undefined){
            scope.shownSeries[key] = true;
            if (scope.separate && scope.separate.yaxis === "all"){
              // add new color for new key
              scope.seriesColor[key] = Highcharts.getOptions().colors[scope.yaxis.length];
              var axis = {
                id: key,
                title: {
                  text: key,
                  style: {
                    color: scope.seriesColor[key]
                  }
                },
                labels: {
                  // format: '{value} mb',
                  style: {
                    color: scope.seriesColor[key]
                  }
                },
                opposite: true
              };
              scope.yaxis.push(axis);
            }
          }
        }

        function filterMessageKeys() {

          var deviceTypes = DeviceTypes.getDeviceTypeList();
          var deviceType;

          var seriesData = {};

          // filter value
          scope.messages.forEach(function (message) {

            var timestamp = new Date(message.timestamp).getTime();
            // filter deviceType if not the same as the last message came from
            if (deviceType === undefined || (deviceType != undefined && deviceType.key !== message.deviceType)) {
              deviceType = $filter('getDeviceType')(deviceTypes, message.deviceType);
            }

            Object.keys(message.deviceMessage).forEach(function (key) {

              // if displayKeys are defined for this deviceType filter these keys from message properties
              if (deviceType && deviceType.displayKeys && deviceType.displayKeys.length > 0) {
                if (deviceType.displayKeys.indexOf(key) !== -1) {
                  formatSerie(seriesData, key, message.deviceMessage[key], timestamp);
                }
              }
              // if no displayKeys are defined for this deviceType display all message properties that are numerical
              else if (typeof message.deviceMessage[key] === "number") {
                formatSerie(seriesData, key, message.deviceMessage[key], timestamp);
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
            if (scope.shownSeries[key] != undefined){
              series[i].visible = scope.shownSeries[key];
            }
            if (scope.separate && scope.separate.yaxis === "all"){
              series[i].yAxis = key;
              series[i].color = scope.seriesColor[key];
            }
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
