/*eslint-env node*/
"use strict";

var Publisher = require("./publisher.js"),
    jsdocEnv = require("jsdoc/env"),
    helper = require("jsdoc/util/templateHelper"),
    tutorial = require("jsdoc/tutorial"),
    jsdocfs = require("jsdoc/fs"),
    resolver = require("jsdoc/tutorial/resolver"),
    fs = require("fs"), path = require("path");

var TEXT_ENCODING = "utf8";

/**
 * Extracts cotnents from doc dir and sets up content for documentation and examples
 * @example
 * // Result:
 * {
 *   // An object referencing a document for index.html in a directory
 *   "index": {
 *      "title": "Charts and Examples", // Title of the document
 *      "doc": "index.md",             // File containig the documentation template
 *      "type": "index",               // Type of document ("index", for files containing TOC, "tutorial" for examples and documentation)
 *      "dest": "charts/index.html",   // File Destination relative to the documentation destination directory
 *      "content": "..."               // Content of the Markdown document
 *      "children": ["line-simple"]    // Child documents to list on TOC
 *   },
 *   // Actual document
 *   "line-simple": {
 *     "title": "Simple Line Chart",
 *     "app": "line-simple.js",      // Javascript file containing example code
 *     "data": "data/line.csv",      // Data file for reference in tutorial
 *     "code": "...",                // Content of "app" javascript file
 *     "group": "charts",            // Group to add this document to
 *     "doc": "line-simple.md",
 *     "type": "tutorial",
 *     "dest": "charts/line-simple.html",
 *     "content": "..."
 *   }
 * }
 */
function findTutorials(filePath, root) {
  var files = jsdocfs.ls(filePath, 10), match,
      finder = /^(.*)\.(x(?:ht)?ml|html?|md|markdown|json)$/i, tutorialData = {};

  files.forEach(function(file) {
    match = file.match(finder);
    if (match) {
      var name = path.basename(match[1]);
      if (root.getByName(name)) {
        tutorialData[name] = tutorialData[name] || {};
        console.log(file, path.extname(file));

        if (path.extname(file) === ".json") {
          try {
            var data = JSON.parse(fs.readFileSync(file).toString(TEXT_ENCODING));
            Object.assign(tutorialData[name], data);
            if (data.group && tutorialData[data.group]) {
              tutorialData[data.group].children.push({ name: name, title: data.title });
            }
          } catch (error) {
            console.error("Failed to parse JSON File:", file, " err:", error.message, error.getStack());
          }

          var docDir = path.dirname(file);
          if (tutorialData[name].type !== "index" && tutorialData[name].type !== "simple") {
            tutorialData[name].dest = path.relative(filePath, docDir) + ".html";
            tutorialData[name].code = fs.readFileSync(path.join(docDir, tutorialData[name].app)).toString(TEXT_ENCODING);
            tutorialData[name].dataContent = fs.readFileSync(path.join(docDir, tutorialData[name].data)).toString(TEXT_ENCODING);
          } else {
            tutorialData[name].dest = path.join(path.relative(filePath, docDir), "index.html");
            tutorialData[name].children = [];
          }
          tutorialData[name].content = fs.readFileSync(path.join(docDir, tutorialData[name].doc)).toString(TEXT_ENCODING);
          tutorialData[name].name = tutorialData[name].title;
        }
      }
    }
  });

  return tutorialData;
};

exports.publish = function(taffyData, opts, tutorials) {
  var publisher = new Publisher(opts);
  resolver.load(opts.tutorialsPath);
  var tutorialData = findTutorials(opts.tutorialsPath, resolver.root);

  publisher.addTutorials(tutorialData);

  var classes = helper.prune(taffyData)({kind: "class"}).map(function(classRecord) {
    // FIXME: This is reqiured as right now taffyDB does not support nested queries for meta data
    if (classRecord && classRecord.meta && classRecord.meta.code) {
      if (classRecord.meta.code.type !== "ClassDeclaration") {
        return;
      }
    }

    helper.registerId(classRecord.longname, publisher.resolveToFile(classRecord.longname));
    helper.registerLink(classRecord.longname, publisher.resolveToFile(classRecord.longname));

    if (classRecord.properties) {
      classRecord.properties.forEach(function(prop) {
        var longname = [classRecord.longname, prop.name].join(".");
        helper.registerId(longname, publisher.resolveToFile(longname));
        helper.registerLink(longname, publisher.resolveToFile(longname));
      });
    }

    classRecord.functions = taffyData({ kind: "function", memberof: classRecord.name, inherited: false }).map(function(functionRecord) {
      helper.registerId(functionRecord.longname, publisher.resolveToFile(functionRecord.longname));
      helper.registerLink(functionRecord.longname, publisher.resolveToFile(functionRecord.longname));
      delete functionRecord.meta;
      return functionRecord;
    });

    classRecord.inherited = {
      functions: taffyData({ kind: "function", memberof: classRecord.name, inherited: true }).map(function(f) {
        return { origin: f.inherits };
      })
    };

    //console.log(classRecord.inherited);

    var description;
    try {
      description = Publisher.marked(classRecord.description);
    } catch (error) {
      console.log("ERROR: ClassRecord did not have a description:", classRecord);
    }

    // Prepending so we can document the constructor too
    classRecord.functions.unshift({
      description: description,
      name: "constructor",
      params: classRecord.params
    });

    classRecord.configProperties = taffyData({ kind: "member", memberof: classRecord.name, name: "configs" }).map(function(configMemberRecord) {
      helper.registerId(configMemberRecord.longname, publisher.resolveToFile(configMemberRecord.longname));
      helper.registerLink(configMemberRecord.longname, publisher.resolveToFile(configMemberRecord.longname));

      delete configMemberRecord.meta;
      return configMemberRecord;
    })[0];

    if (!classRecord.configProperties) {
      classRecord.configProperties = {};
    }

    classRecord.staticMembers = taffyData({ kind: "member", memberof: classRecord.name, scope: "static" }).map(function(staticMemberRecord) {
      helper.registerId(staticMemberRecord.longname, publisher.resolveToFile(staticMemberRecord.longname));
      helper.registerLink(staticMemberRecord.longname, publisher.resolveToFile(staticMemberRecord.longname));

      delete staticMemberRecord.meta;
      return staticMemberRecord;
    });

    return classRecord;
  });

  classes = classes.filter(function(v) {
    return v;
  });
  publisher.classes(classes);

  // FIXME: This is reqiured as right now taffyDB does not support nested queries for meta data
  classes.forEach(function(k) {
    publisher.renderClass(k);
  });

  publisher.renderPage("index.html", opts.readme);
  Object.keys(tutorialData).forEach(function(key) {
    console.log(tutorialData[key]);
    publisher.renderTutorial(tutorialData[key]);
    publisher.copyData(tutorialData[key]);
  });
};

