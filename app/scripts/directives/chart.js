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
      templateUrl: 'views/chart.html',
      restrict: 'EA',
      link: function(scope, elem){

/*        var salesDataToPlot=scope[attrs.chartData];
        var padding = 20;
        var pathClass = "path";
        var xScale, yScale, xAxisGen, yAxisGen, lineFun;
*/
        var d3 = $window.d3;
        var rawSvg = elem.find("svg")[0];
        var svg = d3.select(rawSvg);

        d3.select("body").selectAll("div")
          .data(dataset)
          .enter()
          .append("div")
          .attr("class", function(d){
            if (d.SLA == "1")
              return "bar green";
            else if (d.SLA == "3")
              return "bar red";
            else if (d.SLA == "unbekannt")
              return "bar grey";
          })
          .style("height", function(d) {
            if (d.SLA == "unbekannt")
              return "50px";
            else
              return d.SLA * 100 + "px";
          });

      }
    };
  }]);
