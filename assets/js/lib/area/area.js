"use strict";

import d3 from "d3";
import AxisChart from "../axis/axis.js";

class AreaChart extends AxisChart {

  constructor(container) {
    super(container);

    this.base.classed("chart-area", true);

    Object.assign(this.containers, {
      graph: {
        area: this.base.append("g").classed("visual", true).classed("visual-area", true)
      }
    });

    var chart = this;
    Object.assign(this.layers, {
      graph: this.layer("area", this.containers.graph.area, {
        dataBind: function(data) {
          chart.area = d3.svg.area()
            .interpolate("linear")
            .x(function(d) { return chart.scale.x(d.x); })
            .y(function(d) { return chart.scale.y(d.y); })
            .y0(chart.config("height") - chart.config("margin-top") - chart.config("margin-bottom"));

          return this.selectAll("path").data(data);
        },
        insert: function() {
          return this.append("path").attr("class", function(d, i) { return "area area-index-" + (i + 1); });
        }
      })
    });

    this.layers.graph.on("enter", function() {
      chart.containers.graph.area.attr("transform", "translate(" + chart.config("margin-left") + "," + chart.config("margin-top") + ")");

      chart.containers.axis.x.call(chart.axis.x);
      chart.containers.axis.x.attr("transform", "translate(" + chart.config("margin-left") + "," + (chart.config("height") - chart.config("margin-top")) + ")");
      
      chart.containers.axis.y.call(chart.axis.y);
      chart.containers.axis.y.attr("transform", "translate(" + chart.config("margin-left") + ", " + chart.config("margin-top") + ")");

      return this.attr("d", function(d) {
        return chart.area(d);
      });
    });
  }
}

export default AreaChart;
