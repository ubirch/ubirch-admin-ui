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
      template: '<svg id="visualisation" width="900" height="500"></svg>',//<div id="chart"></div>'
      link: function (scope, element, attrs) {
        var d3 = $window.d3;
        if( attrs.chartData !== undefined) {

          var colors = ['red', 'green', 'blue'];
          var varNames = ['r', 'g', 'b'];

          var data = attrs.chartData;
          data = angular.fromJson(data).hits.hits;

          var lineDataSets = [];

          for (var color=0; color<varNames.length; color++){
            var lineData = [];

            for (var i = 0; i < data.length; i++) {
              var dot = {
                //date: data[i]._source.timestamp,
                date: i,
                value: data[i]._source.deviceMessage.p[varNames[color]]
              };
              lineData[i] = dot;

            }

            lineDataSets[color] = lineData;
          }

          var vis = d3.select('#visualisation'),
            WIDTH = 850,
            HEIGHT = 500,
            MARGINS = {
              top: 20,
              bottom: 20,
              left: 50,
              right: 20
            },
            xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineDataSets[0], function(d) {
             return d.date;
            }), d3.max(lineDataSets[0], function(d) {
              return d.date;
            })]),
            yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineDataSets, function(lineData) {
              return d3.min(lineData, function(d) { return d.value;});
            }), d3.max(lineDataSets, function(lineData) {
              return d3.max(lineData, function(d) { return d.value;});
            })]),
            xAxis = d3.svg.axis()
              .scale(xRange)
              .tickSize(5)
              .tickSubdivide(true),
            yAxis = d3.svg.axis()
              .scale(yRange)
              .tickSize(5)
              .orient('left')
              .tickSubdivide(true);

          vis.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
            .call(xAxis);

          vis.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
            .call(yAxis);

          var lineFunc = d3.svg.line()
            .x(function(d) {
              return xRange(d.date);
            })
            .y(function(d) {
              return yRange(d.value);
            })
            .interpolate('linear');

          for (var index=0; index<varNames.length; index++){
            vis.append('svg:path')
              .attr('d', lineFunc(lineDataSets[index]))
              .attr('stroke', colors[index])
              .attr('stroke-width', 2)
              .attr('fill', 'none');
          }


        }
      }
    };
  }]);
