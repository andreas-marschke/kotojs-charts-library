"use strict";
import BaseChart from "../base/base.js";
import d3 from "d3";
import configs from "./configs.js";
import transforms from "../util/transforms.js";
/**
 * An AxisChart allows you to create a chart that requires an X and Y Axis
 * 
 * @property {Object} containers.axis - A container for Axis components
 * @property {d3.selection} containers.axis.x - d3.selection container appended to your base container used for your X Axis
 * @property {d3.selection} containers.axis.y - d3.selection container appended to your base container used for your Y Axis
 * @property {Object} scale - an object containing d3.scale(s) for your X and Y Axes
 * @property {d3.time.scale} scale.x - Simple `d3.time.scale()` you may re-assign this in your chart if you do not wish to implement a time-series chart
 * @property {d3.scale.linear} scale.y - Simple `d3.scale.linear()` you may re-assign this in your chart if you do not wish to implement a linear chart
 * @property {Object} axis - an object containing `d3.svg.axis`(s) for your X and Y axis
 * @property {d3.svg.axis} axis.x - X Axis for your chart uses {@link AxisChart.scale#x} as a scale
 * @property {d3.svg.axis} axis.x - Y Axis for your chart uses {@link AxisChart.scale#y} as a scale
 *
 * @extends BaseChart
 *
 * @example
 * import AxisChart from "../axis/axis.js";
 * class MyChart extends AxisChart {
 *   constructor(container) {
 *     // Add a new class to your base element
 *     this.base.classed("chart-my", true);
 *
 *     // Use Object.assign to extedn this.containers or override whatever we may need to override
 *     Object.assign(this.containers, {
 *       graph: {
 *         my: this.base.append("g").classed("visual", true).classed("visual-my", true)
 *       }
 *     });
 *
 *     // Once we're setup we can create an actual chart
 *     var chart = this;
 *     Object.assign(this.layers, {
 *       graph: this.layer({
 *         // Add Code for this layer
 *       })
 *     });
 *   }
 * }
 */
class AxisChart extends BaseChart {

  /**
   * Prepares base container for use with an AxisChart:
   *
   * - Adds 2 containers (`.axis-x` and `.axis-y`) for both X and Y Axes
   * - Creates 2 basic scales for `x` and `y`
   * - Creates 2 `d3.svg.axis` applying {@link AxisChart.scale}s
   *
   * @param {d3.selection} container - d3 container selection we will use to draw our charts
   */
  constructor(container) {
    super(container);

    Object.assign(this.configs, configs);
    Object.assign(this.accessors, {
      legend: []
    });
    this.config({
      "ticks-x": 5,
      "ticks-y": 5,
      "orient-x": "bottom",
      "orient-y": "left"
    });

    this.containers = {};
    Object.assign(this.containers, {
      axis: {
        x: this.base.append("g").classed("axis", true).classed("axis-x", true),
        y: this.base.append("g").classed("axis", true).classed("axis-y", true)
      }
    });

    this.scale = {};
    Object.assign(this.scale, {
      x: d3.time.scale(),
      y: d3.scale.linear()
    });

    this.axis = {};
    Object.assign(this.axis, {
      x: d3.svg.axis().scale(this.scale.x),
      y: d3.svg.axis().scale(this.scale.y)
    });
  }
  transform(data) {
    var xKey, values;

    var transformed = transforms.splitDataSet(data);
    console.log(transformed);
    this.scale.x.domain(transformed.xDomain);
    this.scale.y.domain(transformed.yDomain);
    this.accessor("data", transformed.data);

    return transformed.data;
  }

  /**
   * On preDraw we are adjusting the ranges of our scales based on the configured height and width of the chart configured after instantiating our class.
   * We also assign the "theme" to the chart.
   */
  preDraw() {
    super.preDraw();
    // Prior to drawing we are adjusting config based elements here
    this.base.classed("chart-theme-" + this.config("theme"), true);

    this.scale.x.range([0, (this.config("width") - this.config("margin-right") - this.config("margin-left"))]);
    this.scale.y.range([(this.config("height") - this.config("margin-top") - this.config("margin-bottom")), 0]);

    this.containers.axis.x.attr("width", this.config("width")).attr("height", this.config("margin-" + this.config("orient-x")));

    this.axis.x.orient(this.config("orient-x")).ticks(this.config("ticks-x"));
    this.axis.y.orient(this.config("orient-y")).ticks(this.config("ticks-y"));
  }
}

export default AxisChart;
