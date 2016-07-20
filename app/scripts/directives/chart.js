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
            formatChangeX = d3.timeFormat("%d.%B %y %H:%M"),
            formatChangeY = function(x) { return x/1000 + "K";},
            getColor = function(color, alpha) {return "rgba(" + color + "," + alpha + ")";};


          // TODO: get colors from directive
          var colors = ['255,0,0', '0,255,0', '0,0,255'];
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
          var margin = {top: 40, right: 40, bottom: 80, left: 40},
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
                .tickFormat(formatChangeY)
                .tickSize(-width)
                .tickPadding(20)
            );

          g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x)
              .tickFormat(formatChangeX)
              .tickSize(10));

          var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

          ////tooltip
          var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

          var colorGroup = [];

          lineDataSets.forEach (function(lineDataSet, i){
            colorGroup[i] = g.append("g")
              .attr("class", "path-group");

            colorGroup[i].append("path")
              .attr("class", "line")
              .attr("d", line(lineDataSet))
              .attr('stroke', function(){return getColor(colors[i],1);});

            var circles =  colorGroup[i].selectAll("circle")
              .data(lineDataSet)
              .enter()
              .append("circle");
            circles.attr("cx", function(d) {
                return x(d.date);})
              .attr("cy", function(d) {
                return y(d.value);})
              .attr("r", "3" )
              .attr("fill",function(){
                return  getColor(colors[i],1);});
              //tooltip
            circles.on("mouseover", function(d) {
                var elem = d3.select(this),
                   parent = d3.select(this.parentNode);

              //highlight path
                var path = parent.selectAll("path");
                path.style("stroke-width", "2.5px");

              //highlight node
                elem.attr("r", "5");
                parent.append("circle")
                  .attr("id", "shadow")
                  .attr("cx", elem.attr("cx"))
                  .attr("cy", elem.attr("cy"))
                  .attr("r", "9")
                  .attr("stroke", getColor(colors[i],0.2))
                  .attr("stroke-width", "3")
                  .attr("fill","none");

              //tooltip
                div.transition()
                  .duration(200)
                  .style("opacity", 0.9);
                div.html(
                  formatDate(d.date) + "<br/>" +
                  formatTime(d.date) + "<br/><strong>" +
                  paramNames[i] + ": " + d.value + "</strong>")
                  .style("left", d3.event.pageX - (20 +
                    parseFloat(elem.attr("cx") / width * 40)) + "px")
                  .style("top", (d3.event.pageY - 65) + "px");
                div.style("border-color", function(){return  getColor(colors[i],0.3);});
              })
              .on("mouseout", function() {
                var elem = d3.select(this),
                  parent = d3.select(this.parentNode);

                var path = parent.selectAll("path");
                path.style("stroke-width", "1.5px");

                // remove highlight of node
                elem.attr("r", "3");
                d3.select("#shadow").remove();
                // hide tooltip
                div.transition()
                  .duration(500)
                  .style("opacity", 0);
              });
          });

          var legendRectSize = 18;
          var legendSpacing = 4;

          var legendGroup = g.append("g")
            .attr("transform", "translate(100,"+(height+20)+")");

          var legend = legendGroup.selectAll('.legend')
            .data(lineDataSets)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var height = legendRectSize + legendSpacing;
              var offset =  height * lineDataSets.length / 2;
              var horz = -2 * legendRectSize;
              var vert = i * height - offset;
              return 'translate(' + horz + ',' + vert + ')';
            });
          legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function(d,i) { return getColor(colors[i],1);})
            .style('stroke', function(d,i) { return getColor(colors[i],1);});

        }
      }
    };
  }]);
