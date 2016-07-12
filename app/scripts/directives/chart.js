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

          var data = attrs.chartData;
          data = angular.fromJson(data).hits.hits;

          // TODO: get colors from directive
          var colors = ['red', 'green', 'blue'];
          // TODO: get variable names from directive
          var paramNames = ['r', 'g', 'b'];

          //format of timestamp
          var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse,
            formatChange = function(x) { return x/1000 + "K"; };

          //prepare data for chart
          var lineDataSets = [];
          for (var paramIndex=0; paramIndex<paramNames.length; paramIndex++){
            var lineData = [];
            for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
              var dot = {
                date: parseDate(data[dataIndex]._source.timestamp),
                //date: i,
                value: data[dataIndex]._source.deviceMessage.p[paramNames[paramIndex]]
              };
              lineData[dataIndex] = dot;
            }
            lineDataSets[paramIndex] = lineData;
          }

          var vis = d3.select('#visualisation');
          var MARGINS = {
              top: 30,
              bottom: 40,
              left: 50,
              right: 30
            },
            WIDTH = 900 - MARGINS.left - MARGINS.right,
            HEIGHT = 500 - MARGINS.top - MARGINS.bottom;

          var xRange = d3.time.scale()
            .range([0, WIDTH])
            .domain([
              d3.min(lineDataSets[0], function(d) {return d.date;}),
              d3.max(lineDataSets[0], function(d) {return d.date;})
            ]);

          var yRange = d3.scale.linear()
            .range([HEIGHT, 0])
            .domain([
              d3.min(lineDataSets, function(lineData) {return d3.min(lineData, function(d) { return d.value;});}),
              d3.max(lineDataSets, function(lineData) {return d3.max(lineData, function(d) { return d.value;});})
            ]);

          var xAxis = d3.svg.axis()
              .scale(xRange)
              .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(yRange)
              .tickFormat(formatChange)
//              .tickSize(20)
              .orient('left');


          var svg = d3.select("#visualisation")
            .attr("width", WIDTH + MARGINS.left + MARGINS.right)
            .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
            .append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");

          var gX = svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + HEIGHT + ")");

          var gY = svg.append("g")
            .attr("class", "axis axis--y");

          gY.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .text("Change in Price");



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

          for (var index=0; index<paramNames.length; index++){
            vis.append('svg:path')
              .attr('d', lineFunc(lineDataSets[index]))
              .attr("class", "line")
              .attr('stroke', colors[index]);
          }


        }
      }
    };
  }]);
