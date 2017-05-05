"use strict";

import d3 from "d3";
import BaseChart from "../base/base.js";
import configs from "./configs.js";

class PieChart extends BaseChart {
  constructor(container) {
    super(container);

    this.base.classed("chart-pie", true);

    this.config("radius", d3.min(this.config("width"), this.config("height")) / 2);

    Object.assign(this.containers, {
      graph: {
        pie: this.base.append("g").classed("visual", true).classed("visual-pie", true)
      }
    });

    var chart = this;
    chart.pie = d3.svg.arc()
      .outerRadius(this.config("radius") - this.config("radius-margin-outer"))
      .innerRadius(this.config("radius-margin-inner"));
    
    Object.assign(this.layers, {
      graph: this.layer("pie", this.containers.graph.pie, {
        dataBind: function(data) {
          chart.labelPie = d3.svg.arc().sort(null).value(function(d) { return d.x; });          
        }
      })
    });
  }
}

export default PieChart;
