"use strict";

import d3 from "d3";
import AxisChart from "../axis/axis.js";

/**
 * Simple Line Chart for series of data points
 * 
 * @extends AxisChart
 */
class LineChart extends AxisChart {
  /**
   * Line Chart with an X and Y axis 
   * @constructor
   * @param {d3.selection} container - A d3 selection element representing a container node on the DOM
   */
  constructor(container) {
    super(container);

    this.base.classed("chart-line", true);
   
    Object.assign(this.containers, {
      graph: {
        lines: this.base.append("g").classed("visual", true).classed("visual-line", true)
      }
    });

    var chart = this;
    Object.assign(this.layers, {
      graph: this.layer("lines", this.containers.graph.lines, {
        dataBind: function(data) {
          chart.path = d3.svg.line()
            .interpolate("linear")
            .x(function(d) { return chart.scale.x(d.x); })
            .y(function(d) { return chart.scale.y(d.y); });

          return this.selectAll("path").data(data);
        },
        insert: function() {
          return this.append("path").attr("class", function(d, i) { return "line line-index-" + (i + 1); });
        }
      })
    });
    
    this.layers.graph.on("enter", function() {
      chart.containers.graph.lines.attr("transform", "translate(" + chart.config("margin-left") + "," + chart.config("margin-top") + ")");

      chart.containers.axis.x.call(chart.axis.x);
      chart.containers.axis.x.attr("transform", "translate(" + chart.config("margin-left") + "," + (chart.config("height") - chart.config("margin-top")) + ")");
      
      chart.containers.axis.y.call(chart.axis.y);
      chart.containers.axis.y.attr("transform", "translate(" + chart.config("margin-left") + ", " + chart.config("margin-top") + ")");
      
      return this.attr("d", function(d) {
        return chart.path(d);
      });
    });

    this.on("resize", () => {
      this.preDraw();
    });
  }

  preDraw() {
    super.preDraw();
  }
}
export default LineChart;
