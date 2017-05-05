"use strict";
import Koto from "koto";
import configs from "./configs.js";

/**
 * A base chart class exposing configurable entities for all charts extending this chart
 *
 * @extends Koto
 *
 * @property {Object} layers - Object for {@link Koto#Layer} key/value storage you may assign Koto layers to the properties of this object
 * @property {d3.selection} base - Base container used to insert all of your container elements and chart elements
 * @property {Koto.config} configs - Configuration defintition see {@link BaseChart.configs}
 * @property {Koto.accessor} accessors.data - stores array of data values, you may assign this a real value in your transform
 * @property {Object} containers - Object for container key/value storage you may assign svg containers to properties of this object
 *
 * @example
 * import BaseChart from "../base/base.js";
 *
 * class MyChart extends BaseChart {
 *   constructor(container) {
 *     super(container);
 *
 *     // set default width and height
 *     this.config("width", 500);
 *     this.confgi("height", 200);
 *
 *     // extend this.containers to add your own container
 *     Object.assign(this.containers, { myContainer: this.base.append("g").classed("my-container", true) });
 *   }
 *   preDraw() {
 *     super.preDraw();
 *   }
 * }
 */
class BaseChart extends Koto {
  /**
   * Set's up a class with a baseline of features to create charts. Notable things different from basic {@link KotoJS} class:
   *
   * - If {@link BaseChart.base} is not an `<svg>`, append one and reassign {@link BaseChart.base} to this `<svg>`
   * - on {@link BaseChart#preDraw} re-adjusts width and height to the value set by changing {@link BaseChart.configs}
   * - attaches listener to the windows `"resize"` event. You may use this to re-adjust your chart to the current screen size and geometry
   *
   * @param {d3.selection} container - d3 container selection we will use to draw our charts
   */
  constructor(container) {
    super(container);
    Object.assign(this.configs, configs);

    // assume if nodeName is not "svg" that we're in an outer wrapper and need to create svg
    if (container.node().nodeName !== "svg") {
      this.base = container.append("svg").classed("chart", true);
    }

    var self = this;
    window.addEventListener("resize", function(e) {
      self.trigger("resize");
    });

    this.accessors["data"] = { value: [] };

    this.config({
      width: 500,
      height: 300,
      "margin-top": 30,
      "margin-bottom": 30,
      "margin-left": 50,
      "margin-right": 20
    });
    this.layers = {};

    this.containers = {};
  }
  /**
   * Extends base `preDraw` function to adjust width and height to the configured values
   */
  preDraw() {
    super.preDraw();
    this.base.attr("width", this.config("width")).attr("height", this.config("height"));
    //this.trigger("preDraw");
  }
}

export default BaseChart;
