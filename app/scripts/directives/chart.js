'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:chart
 * @description
 * # chart
 */
angular.module('ubirchAdminCrudApp')
  .directive('chart',[ '$window', function ($window) {
    return {
      restrict: 'E',
      replace: true,
      scope: {chartData: '@'
      },
      template: '<div id="chart"></div>',//<svg width='850' height='200'></svg>
      link: function (scope, element, attrs) {
        var d3 = $window.d3;
        if( attrs.chartData !== undefined) {
          var data = attrs.chartData;
          data = angular.fromJson(data);
          d3.select('#chart')
            .append("div").attr("class", "chart")
            .selectAll('div')
            .data(data.hits.hits).enter()
            .append("div")
            .transition().ease("elastic")
            .style("width", function(d) {
              return d._source.deviceMessage.p.ba + "%";
            })
            .text(function(d) {
              return d._source.deviceMessage.p.ba + "%";
            });
        }
      }
    };
  }]);
