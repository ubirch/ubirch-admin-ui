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
            if (seriesData[key] === undefined){
              seriesData[key] = [];
            }
            seriesData[key].push([ timestamp, message.deviceMessage[key]]);
          });
        });

        var series = [], i = 0;

        Object.keys(seriesData).forEach(function(key){
          series[i] = {};
          series[i].data = seriesData[key];
          series[i].name = key;
          i++;
        });

        Highcharts.chart(element[0], {
          chart: {
            type: 'line'
          },
          title: {
            text: 'Sensor data'
          },
          xAxis: {
            title: {
              text: 'Datum'
            },
            type: 'datetime'
          },
          series: series
        });

      }
    };
  });
