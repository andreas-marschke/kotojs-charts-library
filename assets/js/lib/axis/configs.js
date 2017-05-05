/**
 * Configuration fields accessible to chart instances
 *
 * @memberof AxisChart
 * @name configs
 * @type {Object}
 * @property {boolean} has-axis - Defines if the element should display a set of axes or not
 * @property {number} ticks-x - X Axis distance between ticks see the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md|d3 documentation on axes and ticks}
 * @property {number} ticks-y - Y Axis distance between ticks see the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md|d3 documentation on axes and ticks}
 * @property {string} orient-x  - X Axis orientation 'top' or 'bottom', see the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md|d3 documentation on SVG Axes}
 * @property {string} orient-x - Y Axis orientation 'left' or 'right', see the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md|d3 documentation on SVG Axes}
 */
var config = { 
  "has-axis": {
    type: "boolean",
    value: false
  },
  "ticks-x": {
    type: "number",
    value: 5
  },
  "ticks-y": {
    type: "number",
    value: 5
  },
  "orient-x": {
    type: "string",
    value: "bottom"
  },
  "orient-y": {
    type: "string",
    value: "left"
  }
};

export default config;


