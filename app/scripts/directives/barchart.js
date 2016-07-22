'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:barchart
 * @description
 * # barchart
 */
angular.module('ubirchAdminCrudApp')
  .directive('barchart',[ '$window', function ($window) {
    return {
      restrict: 'E',
      replace: true,
      scope: {chartData: '@'
      },
      template: '<svg id="barchartvis" width="900" height="500"></svg>',
      link: function (scope, element, attrs) {
        var d3 = $window.d3;

        if( attrs.chartData !== undefined) {

          var chartData = angular.fromJson(attrs.chartData).hits.hits;

          var parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ"),
            formatDate = d3.timeFormat("%d.%B %y"),
            formatTime = d3.timeFormat("%H:%M:%S"),
            formatChangeX = d3.timeFormat("%d.%B %y %H:%M"),
            formatChangeY = function(x) { return x/1000 + "K";};


          //prepare data for chart
          var data = [];
          chartData.forEach (function(d){
            data.push(
              {
                date: parseDate(d._source.timestamp),
                  r: d._source.deviceMessage.p.r,
                  g: d._source.deviceMessage.p.g,
                  b: d._source.deviceMessage.p.b
              }
            );
          });

          var svg = d3.select("#barchartvis"),
            margin = {top: 20, right: 20, bottom: 40, left: 60},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var x = d3.scaleUtc()
            .range([0, width])
            .domain(d3.extent(data, function(d) { return d.date;}));

          var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0,
              d3.max(data, function(d) {
                return d.r+d.g+d.b;})
            ]);

          var z = d3.scaleOrdinal()
            .range(["#FF0000", "#00FF00", "#0000FF"])
            .domain(Object.keys(data[0]).slice(1));

          ////tooltip
          var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

          var stack = d3.stack();

          g.selectAll(".serie")
            .data(stack.keys(Object.keys(data[0]).slice(1))(data))
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", function(d) { return z(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data.date); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", "5")
          //tooltip
            .on("mouseover", function(d) {
              var parent = d3.select(this.parentNode),
                param = parent.data()[0].key;

              //highlight
              parent.append("rect")
                .attr("id", "shadow")
                .attr("x", this.x.baseVal.value - 2)
                .attr("y", this.y.baseVal.value - 2)
                .attr("width", this.width.baseVal.value + 4)
                .attr("height", this.height.baseVal.value + 4)
                .attr("fill", function(){return  getRGBA(z(param),0.3);});

              //tooltip
              div.transition()
                .duration(200)
                .style("opacity", 0.9);
              div.html(
                  formatDate(d.data.date) + "<br/>" +
                  formatTime(d.data.date) + "<br/>" +
                  "<strong>" + param + ": " + d[1] + "</strong>")
                .style("left", (d3.event.pageX - (20 +
                parseFloat(this.x.baseVal.value / width * 40)) + "px"))
                .style("top", (d3.event.pageY - 65) + "px");
              div.style("border-color", function(){return  getRGBA(z(param),0.3);});
            })
            .on("mouseout", function() {
              d3.select("#shadow").remove();
              // hide tooltip
              div.transition()
                .duration(500)
                .style("opacity", 0);
            });


          g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y)
              .tickFormat(formatChangeY)
              .tickSize(-width)
              .tickPadding(20))
            .append("text")
            .attr("x", function(){return width/2;})
            .attr("y", function(){return height + margin.bottom -5;})
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .attr("fill", "#000")
              .text("Date");

          g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x)
              .tickFormat(formatChangeX)
              .tickSize(10))
              .append("text")
                .attr("x", function(){return height/2;})
                .attr("y", function(){return 5-margin.left;})
                .attr("transform","rotate(270)")
                .attr("dy", "0.35em")
                .attr("text-anchor", "start")
                .attr("fill", "#000")
                .text("Value sent");

          var legend = g.selectAll(".legend")
            .data(Object.keys(data[0]).slice(1))
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
