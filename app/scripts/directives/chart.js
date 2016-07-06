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
      template: '<div id="chart"></div>',
      link: function (scope, element, attrs) {
        var d3 = $window.d3;
        var data = attrs.data.split(','),
          chart = d3.select('#chart')
            .append("div").attr("class", "chart")
            .selectAll('div')
            .data(data).enter()
            .append("div")
            .transition().ease("elastic")
            .style("width", function(d) { return d + "%"; })
            .text(function(d) { return d + "%"; });
      }
    };
  }]);
