'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:highchart
 * @description
 * # highchart
 */
angular.module('ubirchAdminCrudApp')
  .directive('hcChart', function () {
    return {
      template: '<div id="hc_container"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        messages: '='
      },
      link: function postLink(scope, element) {
        var seriesData = {};
        scope.messages.forEach(function(message){

          var timestamp = Date.parse(message.timestamp);

          Object.keys(message.deviceMessage).forEach(function(key){
            if (typeof message.deviceMessage[key] === "number"){
              if (seriesData[key] === undefined){
                seriesData[key] = [];
              }
              seriesData[key].push([ timestamp, message.deviceMessage[key]]);
            }
          });
        });

        var series = [], i = 0;

        Object.keys(seriesData).forEach(function(key){
          series[i] = {};
          series[i].data = seriesData[key];
          series[i].name = key;
          i++;
        });

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

      }
    };
  });
