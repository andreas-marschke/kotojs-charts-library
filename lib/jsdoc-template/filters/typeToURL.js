/*eslint-env node*/
"use strict";
var helper = require("jsdoc/util/templateHelper"),
    external = require("./inheritance-ext.json");

/**
 * Use this in templates to add links to external classes that are not part of the documented classes but external
 * Works for types as well as classes.
 *
 * @example
 * <!-- usage -->
 * {{ class.augments[0] | typeToURL }}
 */
module.exports = function(className) {
  if (helper.longnameToUrl.hasOwnProperty(className)) {
    return helper.longnameToUrl[className];
  } else if (external.hasOwnProperty(className)) {
    return external[className];
  }
  return "";
};
