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
      template: '<svg id="visualisation" width="900" height="500"></svg>',
      link: function (scope, element, attrs) {
        var d3 = $window.d3;
        if( attrs.chartData !== undefined) {

          var data = attrs.chartData;
          data = angular.fromJson(data).hits.hits;

          //format of timestamp
          var parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ"),
            formatDate = d3.timeFormat("%d.%B %y"),
            formatTime = d3.timeFormat("%H:%M:%S"),
            formatChange = function(x) { return x/1000 + "K"; };


          // TODO: get colors from directive
          //var colors = ['red', 'green', 'blue'];
          // TODO: get variable names from directive
          var paramNames = ['r', 'g', 'b'];

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


          var svg = d3.select("#visualisation");
          var margin = {top: 40, right: 40, bottom: 40, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

          var x = d3.scaleUtc()
            .range([0, width])
            .domain([
              d3.min(lineDataSets[0], function(d) { return d.date;}),
              d3.max(lineDataSets[0], function(d) { return d.date;})
            ]);

          var y = d3.scaleLinear()
            .range([height, 0])
            .domain([
              d3.min(lineDataSets, function(lineData) { return d3.min(lineData, function(d) { return d.value;});}),
              d3.max(lineDataSets, function(lineData) { return d3.max(lineData, function(d) { return d.value;});})
            ]);

          var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y)
                .tickFormat(formatChange)
                .tickSize(-width)
                .tickPadding(20)
            );

          g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x)
              .tickFormat(formatDate));

          //svg.append("g")
          //  .attr("class", "axis axis--x")
          //  .attr("transform", "translate(0," + HEIGHT + ")")
          //  .call(xAxis);
          //
          //
          //svg.append("g")
          //  .attr("class", "axis axis--y")
          //  .call(d3.svg.axis()
          //    .scale(yRange)
          //    .tickFormat(formatChange)
          //    .tickSize(-WIDTH)
          //    .tickPadding(20)
          //    .orient('left'));
          //
          //var line = d3.svg.line()
          //  .x(function(d) {
          //    return xRange(d.date); })
          //  .y(function(d) {
          //    return yRange(d.value); });
          //
          ////tooltip
          //var div = d3.select("body").append("div")
          //  .attr("class", "tooltip")
          //  .style("opacity", 0);
          //
          //var g = [];
          //
          //lineDataSets.forEach (function(lineDataSet, i){
          //  g[i] = svg.append("g")
          //    .attr("class", "path-group");
          //
          //  g[i].append("path")
          //    .attr("class", "line")
          //    .attr("d", line(lineDataSet))
          //    .attr('stroke', function(){return colors[i];});
          //
          //  var circles =  g[i].selectAll("circle")
          //    .data(lineDataSet)
          //    .enter()
          //    .append("circle");
          //  circles.attr("cx", function(d) {
          //      return xRange(d.date);})
          //    .attr("cy", function(d) {
          //      return yRange(d.value);})
          //    .attr("r", "3" )
          //    .attr("stroke",function(){
          //      return colors[i];})
          //    .attr("fill", "white")
          //    //tooltip
          //    .on("mouseover", function(d) {
          //      div.transition()
          //        .duration(200)
          //        .style("opacity", 0.9);
          //      div.html(formatDate(d.date) + "<br/>" + formatTime(d.date) + "<br/>" + d.value)
          //        .style("left", (d3.event.pageX - (
          //          parseFloat(d3.select(this).attr("cx")) / WIDTH * 40) ) + "px")
          //        .style("top", (d3.event.pageY - 45) + "px");
          //    })
          //    .on("mouseout", function() {
          //      div.transition()
          //        .duration(500)
          //        .style("opacity", 0);
          //    });
          //
          //});

        }
      }
    };
  }]);
