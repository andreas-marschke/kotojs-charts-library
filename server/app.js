/*eslint-env node*/
"use strict";

var path = require("path"),
    http = require("http"),
    express = require("express"),
    index = require("serve-index"),
    sstatic = require("serve-static");

var port = process.env.PORT || 3000, app = module.exports = express();
app.use("/", index(path.join(__dirname, "..", "dist")));
app.use("/", sstatic(path.join(__dirname, "..", "dist"), {
  setHeaders: cacheControl
}));

http.createServer(app).listen(port, function() {
  console.log("Server Running on Port:", port);
});

function cacheControl(res, url) {
  if (sstatic.mime.lookup(url) === "text/html") {
    // Custom Cache-Control for HTML files
    res.setHeader("Cache-Control", "public, max-age=0");
  }
}
