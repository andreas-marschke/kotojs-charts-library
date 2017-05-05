import d3 from "d3";

var transforms = {
  /**
   * Organizes data. Expects data to be an array of objects where the first extracted key maps to the X-Axis of your chart and the rest evaluates to
   * multiple individual sets of X and Y. This means that your first element will always be mapped to X every subsequent value to a Y value for its 
   * individual data point.
   * 
   * The original dataset is used to find the X/Y scale domains. Once this is done the transformation described below happens, after that, the 
   * data accessor is assigned the transformed data
   *
   * @param {object[]} data - array of datapoints
   *
   * @return {object[]} Transformed dataset
   *
   * @example
   * // Take a generic set of one data point:
   * var data = [{
   *   date: 1234, // a date epoch,
   *   value1: 15, // First value,
   *   value2: 33, // Second value
   * }];
   *
   * // After transform will look like this:
   * var data [[{
   *   x: 1234, // still the same date value but applied as X value
   *   y: 15,   // First value, now it's own Y Axis value
   *   index: 0 // The index in the keyset this Y value resided in, used later to apply color palettes as classes
   * }],
   * [{
   *   x: 1234, // still the same date value but applied as X value
   *   y: 33,   // `value2` from the original value set now has it's own object and x,y value array
   *   index: 1 // again the array index at which we found the value key
   * }]];
   */
  splitDataSet: function (data) {
    var xDomain, yDomain, xKey, values, maps;

    xKey = Object.keys(data[0])[0];
    values = Object.keys(data[0]).filter((x) => { return xKey !== x; });

    xDomain = d3.extent(data, (d) => {
      return d[xKey];
    });
    
    yDomain = [0, d3.max(data, (d) => {
      return d3.max(values.map((v) => { return d[v]; }));
    })];

    return {
      xDomain: xDomain,
      yDomain: yDomain,
      data: values.map((y, yIndex, yArray) => {
        return data.map((dataPoint, index, array) => {
          return {
            x: dataPoint[xKey],
            y: dataPoint[y],
            index: yIndex
          };
        });
      }),
      values: values
    };
  }
};

export default transforms;
