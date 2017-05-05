/*eslint-env node*/
"use strict";
var fs = require("fs");
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    eslint: {
      options: {
        format: "compact"
      },
      target: [
        "Gruntfile.js",
        "webpack.config.js",
        "server/app.js",
        "lib/jsdoc-template/**/*.js",
        "assets/js/lib/**/*.js",
        "assets/tutorials/**/*.js"
      ]
    },
    clean: {
      options: {},
      dist: ["dist/**"]
    },
    copy: {
      font: {
        files: [{
          expand: true,
          cwd: "assets/vendor/bootstrap/dist",
          src: ["fonts/**"],
          dest: "dist/"
        },{
          expand: true,
          cwd: "assets/vendor/font-awesome/",
          src: ["fonts/**"],
          dest: "dist/"
        }]
      }
    },
    less: {
      charts: {
        options: {
          paths: ["assets/less/charts"]
        },
        files: {
          "dist/css/charts.css": [
            "assets/less/charts/**/*.less"
          ]
        }
      },
      docs: {
        options: {
          paths: ["assets/less/docs"]
        },
        files: {
          "dist/css/docs.css": [
            "assets/less/docs/**/*.less"
          ]
        }
      },
      main: {
        options: {
          paths: ["assets/less"]
        },
        files: {
          "dist/css/main.css": [
            "assets/less/*.less"
          ]
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      "deps": {
        files: {
          "dist/css/deps.min.css": [
            "assets/vendor/highlightjs/styles/vs.css",
            "assets/vendor/bootstrap/dist/css/bootstrap.css",
            "assets/vendor/font-awesome/css/font-awesome.css"
          ]
        }
      },
      target: {
        files: {
          "dist/css/styles.min.css": [ "dist/css/charts.css" ]
        }
      },
      documentation: {
        files: {
          "dist/css/docs.min.css": [ "dist/css/docs.css" ]
        }
      },
      main: {
        files: {
          "dist/css/main.min.css": [ "dist/css/main.css" ]
        }
      }
    },
    webpack: {
      charts: require("./webpack.config.js")
    },
    uglify: {
      options: {
        mangle: true,
        sourceMap: false
      },
      dist: {
        files: {
          "dist/js/deps.min.js": [
            "assets/vendor/highlightjs/highlight.pack.js",
            "assets/vendor/jquery/dist/jquery.min.js",
            "assets/vendor/bootstrap/dist/js/bootstrap.js",
            "assets/vendor/d3/d3.min.js",
            "assets/vendor/d3-tip/index.js",
            "assets/vendor/koto/dist/koto.js"
          ]
        }
      },
      charts: {
        files: {
          "dist/js/chart.min.js": [
            "dist/js/chart.js"
          ]
        }
      },
      app: {
        files: {
          "dist/js/app.min.js": [
            "assets/js/app/*.js"
          ]
        }
      }
    },
    protractor: {
      options: {
        noColor: false,
        keepAlive: false
      },
      phantomjs: {
        configFile: "tests/protractor.config.phantom.js"
      }
    },
    protractor_webdriver: {
      options: {
        keepAlive: true
      },
      e2e: {}
    },
    express: {
      options: {
        args: [],
        background: true,
        fallback: function() {},
        port: 3000,
        harmony: false,
        debug: false,
        breakOnFirstLine: false
      },
      dev: {
        options: {
          script: "server/app.js"
        }
      }
    },
    jsdoc: {
      dist: {
        src: [ "assets/js/lib/**/*.js" ],
        options: {
          destination: "dist/docs",
          package: "./package.json",
          readme: "./README.md",
          template: "./lib/jsdoc-template",
          configure: "./jsdoc.conf.json"
        }
      }
    },
    watch: {
      styles: {
        files: [
          "assets/less/**/*.less"
        ],
        tasks: ["less", "cssmin"]
      },
      charts: {
        files: [
          "assets/js/lib/**/*.js"
        ],
        tasks: ["webpack:charts", "uglify:charts"]
      },
      dist: {
        files: [
          "assets/vendor/**/*.js"
        ],
        tasks: ["uglify:dist"]
      },
      docs: {
        files: [
          "lib/jsdoc-template/**/*.js",
          "lib/jsdoc-template/**/*.nunjucks",
          "lib/jsdoc-template/**/*.json",
          "assets/tutorials/**/*.js",
          "assets/tutorials/**/*.md",
          "assets/tutorials/**/*.json",
          "assets/tutorials/**/*.csv"
        ],
        tasks: ["jsdoc"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-express-server");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("gruntify-eslint");
  grunt.loadNpmTasks("grunt-jsdoc");

  grunt.registerTask("build", ["webpack", "uglify", "less", "cssmin", "jsdoc", "copy"]);
  grunt.registerTask("server", ["build", "express:dev", "watch"]);
};
