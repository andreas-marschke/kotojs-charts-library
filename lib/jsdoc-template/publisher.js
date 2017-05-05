/*eslint-env node*/
"use strict";
var path = require("path"),
    fs = require("fs"),
    helper = require("jsdoc/util/templateHelper"),
    nunjucks = require("nunjucks"),
    NunjucksCodeHighlighting = require("nunjucks-highlight.js"),
    HighlightJs = require("highlight.js"),
    njHlJs = new NunjucksCodeHighlighting(nunjucks, HighlightJs),
    mkdirp = require("mkdirp"),
    markdown = require("nunjucks-markdown"),
    marked = require("marked");

var TEXT_ENCODING = "utf8";

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code) {
    return require("highlight.js").highlightAuto(code).value;
  },
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

var classes;

function Publisher(opts) {
  // [plugins/*.js]
  this.plugins = {};

  // Nunjucks config
  this.njOpts = {
    autoescape: false,
    lstripBlocks: true
  };

  var packageJson;
  try {
    // PackageJson file path
    packageJson = opts.package && require(path.resolve(opts.package));
  }
  catch(err) {
    packageJson = {
      name: "genericPackage",
      version: "9.9.9",
      repository: {
        url : "http://example.com"
      },
      license: "WTFL",
      bugs: {
        url: "http://bugs.example.com"
      }
    };
  }
  // Prefilling with generic data
  this.packageJson = packageJson;

  // Path to template and this file
  this.templPath = path.resolve(path.join(__dirname, "views"));

  // nunjucks templates
  this.loaderDirs = [
    path.resolve(path.join(this.templPath, "layout")),
    path.resolve(path.join(this.templPath, "includes")),
    path.resolve(path.join(this.templPath))
  ];

  this.paths = {
    urlBase: opts.basePath,
    // <destination>/<package-name>/<version>/
    base: opts.versioned ? path.join(this.packageJson.name, this.packageJson.version) : "",
    destination: path.resolve(opts.destination)
  };

  // <destination>/<package-name>/<version>/api
  this.paths.api = path.join(this.paths.base, "api"),
  this.paths.data = path.join(this.paths.destination, opts.dataDir);


  // FS Loader for Nunjucks Templates
  this.loader = new nunjucks.FileSystemLoader(this.loaderDirs);

  // Nunjucks Environment
  this.nunjucksEnv = new nunjucks.Environment(this.loader, this.njOpts);
  this.nunjucksEnv.addExtension("NunjucksCodeHighlight", njHlJs);
  markdown.register(this.nunjucksEnv, marked);
}

Publisher.prototype.classes = function(_classes) {
  classes = _classes;
};

Publisher.prototype.addTutorials = function(tutorials) {
  helper.setTutorials(tutorials);
  this.tutorials = tutorials;
};

Publisher.prototype.resolveToFile = function(name) {
  var apiBasePath = path.join(this.paths.urlBase, "api"), m = name.split("#"),p;

  if (m && m.length > 1) {
    p = path.join(apiBasePath, m[0] + ".html" + "#function-" + m[1]);
    return p;
  }

  m = name.split(".");
  if (m && m.length > 1) {
    p = path.join(apiBasePath, m[0] + ".html" + "#property-" + m[1]);
    return p;
  }

  m = name.split("~");
  if (m && m.length > 1) {
    p = path.join(apiBasePath, m[0] + ".html" + "#event-" + m[1]);
    return p;
  }

  return path.join(apiBasePath, name + ".html");
};

Publisher.prototype.renderPage = function(page, content) {
  var _tutorials = Object.keys(this.tutorials).map(function(v) { return this.tutorials[v]; }, this);
  this.write(this.nunjucksEnv.render("simple.nunjucks", { simple: content, classes: classes, package: this.packageJson, tutorials: _tutorials }), path.join(this.paths.destination, page));
};

Publisher.prototype.renderClass = function(record) {

  this.nunjucksEnv.addFilter("typeToURL", require("./filters/typeToURL"));
  this.nunjucksEnv.addFilter("typesToURL", require("./filters/typesToURL"));
  this.nunjucksEnv.addFilter("toLinks", require("./filters/toLinks"));
  var configProperties, properties, functions;

  if (record.configProperties && JSON.stringify(record.configProperties) !== "{}") {
    configProperties = this.nunjucksEnv.render("properties.nunjucks", { description: record.configProperties.description,
                                                                        properties: record.configProperties.properties });
  }

  if (record.properties) {
    properties = this.nunjucksEnv.render("properties.nunjucks", { properties: record.properties });
  }

  if (record.functions) {
    functions = this.nunjucksEnv.render("functions.nunjucks", { functions: record.functions });
  }
  var _tutorials = Object.keys(this.tutorials).map(function(v) { return this.tutorials[v]; }, this);
  var rendered = this.nunjucksEnv.render("class.nunjucks", {
    class: record,
    classes: classes,
    properties: properties,
    functions: functions,
    configs: configProperties,
    package: this.packageJson,
    tutorials: _tutorials
  });

  rendered = helper.resolveLinks(rendered);

  this.write(rendered, path.join(this.paths.destination, this.paths.base, this.paths.api, record.name + ".html"));

  return rendered;
};

Publisher.prototype.renderTutorial = function (tutorial) {
  this.nunjucksEnv.addFilter("typeToURL", require("./filters/typeToURL"));
  this.nunjucksEnv.addFilter("typesToURL", require("./filters/typesToURL"));
  this.nunjucksEnv.addFilter("toLinks", require("./filters/toLinks"));
  var rendered;
  var _tutorials = Object.keys(this.tutorials).map(function(v) { return this.tutorials[v]; }, this);

  if (tutorial.type !== "index") {
    rendered = this.nunjucksEnv.render("guide.nunjucks", { guide: tutorial, classes: classes, package: this.packageJson, tutorials: _tutorials });
  }
  else {
    rendered = this.nunjucksEnv.render("guide-index.nunjucks", { guide: tutorial, classes: classes, package: this.packageJson, tutorials: _tutorials });
  }
  this.write(rendered, path.join(this.paths.destination, this.paths.base, tutorial.dest));
};

Publisher.prototype.copyData = function(tutorial) {
  if (tutorial.data) {
    this.write(tutorial.dataContent, path.join(this.paths.destination, tutorial.data));
  }
};

Publisher.prototype.write = function (rendered, destination) {
  var directory = path.dirname(destination);
  var fileName = path.basename(destination);
  if (!path.isAbsolute(directory)) {
    directory = path.resolve(directory);
  }

  // Check if the api directory is available or not
  try {
    fs.accessSync(directory, fs.FS_OK);
  }
  catch(exception) {
    mkdirp.sync(directory);
  }

  var destFile = path.join(directory, fileName);
  try
  {
    fs.writeFileSync(destFile, rendered, {encoding: "utf8"});
  }
  catch(exception)
  {
    return false;
  }

  return true;
};

Publisher.marked = marked;

module.exports = Publisher;
