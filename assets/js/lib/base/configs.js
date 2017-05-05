/**
 * Configuration fields accessible to chart instances
 *
 * @memberof BaseChart
 * @name configs
 * @type {Object}
 * @property {number} width - Width of the SVG element displayed on the page in pixels
 * @property {number} height - Height of the SVG element displayed on the page in pixels
 * @property {number} margin-top - Top margin of the SVG element displayed on the page in pixels
 * @property {number} margin-left - Left margin of the SVG element displayed on the page in pixels
 * @property {number} margin-bottom - Bottom margin of the SVG element displayed on the page in pixels
 * @property {number} margin-right - Right margin of the SVG element displayed on the page in pixels
 * @property {number} ticks-x - X Axis distance between ticks see the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md|d3 documentation on axes and ticks}
 * @property {number} ticks-y - Y Axis distance between ticks see the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md|d3 documentation on axes and ticks}
 * @property {string} orient-x  - X Axis orientation 'top' or 'bottom', see the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md|d3 documentation on SVG Axes}
 * @property {string} orient-x - Y Axis orientation 'left' or 'right', see the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md|d3 documentation on SVG Axes}
 * @property {string} theme - Theme for the chart, defined color palletes used for chart legend/items
 *
 * @example
 * // setting a new value for the width of the chart element (this.base)
 * this.config("width", 800);
 *
 * @example
 * // Getting configuration
 * this.config("theme");
 */
export default { 
  "width": {
    value: 500
  },
  "height": {
    value: 300
  },
  "margin-top":  {
    value: 30
  },
  "margin-left":  {
    value: 30
  },
  "margin-bottom": {
    value: 30
  },
  "margin-right": {
    value: 30
  }, 
  "ticks-x": {
    value: 5
  },
  "ticks-y": {
    value: 5
  },
  "orient-x": {
    value: "bottom"
  },
  "orient-y": {
    value: "left"
  },
  "theme": {
    value: "default"
  }
};


