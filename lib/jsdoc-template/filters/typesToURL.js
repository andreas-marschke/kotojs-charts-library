/*eslint-env node*/
"use strict";
var typeToURL = require("./typeToURL.js"),
    nunjucks = require("nunjucks"),
    env = new nunjucks.configure();

module.exports = function(typesArray) {
  return typesArray.map(function(v) {
    var name = env.renderString("{{ v | escape }}", { v: v });
    var url = typeToURL(v);
    return { name: name, url: url };
  });
};

