/*eslint-env node*/
"use strict";
module.exports = function(types) {
  var string = [], index = 0;
  for (index = 0; index < types.length; index++) {
    string.push("<a href=\"" + types[index].url + "\"><code>" + types[index].name + "</code><i class=\"fa fa-external-link\" aria-hidden=\"true\"></i></a>");
  }
  return string;
};
