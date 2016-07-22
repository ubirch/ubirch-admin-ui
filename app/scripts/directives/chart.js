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

          var data = angular.fromJson(attrs.chartData).hits.hits;

          //format of timestamp
          var parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ"),
            formatDate = d3.timeFormat("%d.%B %y"),
            formatTime = d3.timeFormat("%H:%M:%S"),
            formatChangeX = d3.timeFormat("%d.%B %y %H:%M"),
            formatChangeY = function(x) { return x/1000 + "K";};


          // TODO: get colors from directive
          var colors = ["#FF0000", "#00FF00", "#0000FF"];
          // TODO: get variable names from directive
          var paramNames = ['r', 'g', 'b'];

          //prepare data for chart
          var lineDataSets = [];
          forEach (data, function(d){
            lineDataSets.push(
              {
                date: parseDate(d._source.timestamp),
                data: {
                  r: d._source.deviceMessage.p.r,
                  g: d._source.deviceMessage.p.g,
                  b: d._source.deviceMessage.p.b
                }
              }
            )
          });

          var svg = d3.select("#visualisation");
          var margin = {top: 40, right: 40, bottom: 80, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

          var x = d3.scaleUtc()
            .range([0, width])
            .domain(d3.extent(lineDataSets, function(d) { return d.date;}));

          var y = d3.scaleLinear()
            .range([height, 0])
            .domain([
              d3.min(lineDataSets, function(d) { return d3.min([d.data.r, d.data.g, d.data.b]);}),
              d3.max(lineDataSets, function(d) { return d3.max([d.data.r, d.data.g, d.data.b]);})
            ]);

          var z = d3.scaleOrdinal()
            .range(colors);

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

          ////tooltip
          var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

          var colorGroup = g.selectAll("g")
            .data(lineDataSets[0].data)
            .enter().append("g")
            .attr("class", "path-group");

          var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

          var path = colorGroup.append("path")
            .attr("class", "line")
            .attr("d", line(lineDataSet))
            .attr('stroke', function(){return getRGBA(colors[i],1);});

          //var circles =  colorGroup[i].selectAll("circle")
          //    .data(lineDataSet)
          //    .enter()
          //    .append("circle");
          //  circles.attr("cx", function(d) {
          //      return x(d.date);})
          //    .attr("cy", function(d) {
          //      return y(d.value);})
          //    .attr("r", "3" )
          //    .attr("fill",function(){
          //      return  getRGBA(colors[i],1);});
          //    //tooltip
          //  circles.on("mouseover", function(d) {
          //      var elem = d3.select(this),
          //         parent = d3.select(this.parentNode);
          //
          //    //highlight path
          //      var path = parent.selectAll("path");
          //      path.style("stroke-width", "2.5px");
          //
          //    //highlight node
          //      elem.attr("r", "5");
          //      parent.append("circle")
          //        .attr("id", "shadow")
          //        .attr("cx", elem.attr("cx"))
          //        .attr("cy", elem.attr("cy"))
          //        .attr("r", "9")
          //        .attr("stroke", getRGBA(colors[i],0.2))
          //        .attr("stroke-width", "3")
          //        .attr("fill","none");
          //
          //    //tooltip
          //      div.transition()
          //        .duration(200)
          //        .style("opacity", 0.9);
          //      div.html(
          //        formatDate(d.date) + "<br/>" +
          //        formatTime(d.date) + "<br/><strong>" +
          //        paramNames[i] + ": " + d.value + "</strong>")
          //        .style("left", d3.event.pageX - (20 +
          //          parseFloat(elem.attr("cx") / width * 40)) + "px")
          //        .style("top", (d3.event.pageY - 65) + "px");
          //      div.style("border-color", function(){return  getRGBA(colors[i],0.3);});
          //    })
          //    .on("mouseout", function() {
          //      var elem = d3.select(this),
          //        parent = d3.select(this.parentNode);
          //
          //      var path = parent.selectAll("path");
          //      path.style("stroke-width", "1.5px");
          //
          //      // remove highlight of node
          //      elem.attr("r", "3");
          //      d3.select("#shadow").remove();
          //      // hide tooltip
          //      div.transition()
          //        .duration(500)
          //        .style("opacity", 0);
          //    });
          //});


          var legendGroup = g.append("g")
            .attr("transform", "translate(100,"+(height+20)+")");

          var legend = legendGroup.selectAll('.legend')
            .data(data.columns.slice(1).reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
            .style("font", "10px sans-serif");

          legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", z);

          legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(function(d) { return d; });

        }

        function getRGBA(color,alpha){
          if(color.length === 7){
            var r = parseInt(color.substr(1,2),16);
            var g = parseInt(color.substr(3,2),16);
            var b = parseInt(color.substr(5,2),16);
            return 'rgba('+r+','+g+','+b+','+alpha+')' ;
          }
        }
      }
    };
  }]);
