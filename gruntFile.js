module.exports = function(grunt) {
  // Load all tasks
  require('load-grunt-tasks')(grunt);

  var jsFileList = grunt.file.readJSON('build-js.json');
  var cssFileList = grunt.file.readJSON('build-css.json');

  grunt.initConfig({
    distdir: 'app',
    pkg: grunt.file.readJSON('package.json'),
    src: {
      js: ['app/**/*.js', '!app/**/*_test.js', '!app/app.bundle.*'],
      jsTpl: ['<%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      },
      less: ['less/app.less'],
      lessWatch: ['less/**/*.less']
    },

    jshint:{
      files:['gruntFile.js', '<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    },
    concat: {
      options: {
        separator: ';\n',
      },
      js: {
        src: [jsFileList, '<%= src.js %>', '<%= src.jsTpl %>'],
        dest: '<%= distdir %>/app.bundle.js',
      },
      css: {
        src: [cssFileList],
        dest: '<%= distdir %>/app.bundle.css',
      },
      css_build: {
        src: [
          cssFileList.slice(0, -1),
          '<%= distdir %>/app.bundle.min.css'
        ],
        dest: '<%= distdir %>/app.bundle.min.css',
      },
    },
    less: {
      dev: {
        files: {
          '<%= distdir %>/app.bundle.css': [
            '<%= src.less %>'
          ]
        },
        options: {
          compress: false,
          // LESS source map
          // To enable, set sourceMap to true and update sourceMapRootpath based on your install
          sourceMap: true,
          // sourceMapFilename: 'app.css.map',
          sourceMapURL: '<%= distdir %>/app.bundle.css.map',
          // sourceMapRootpath: '/',
          outputSourceFiles: true,
        }
      },
      build: {
        files: {
          '<%= distdir %>/app.bundle.min.css': [
            '<%= src.less %>'
          ]
        },
        options: {
          compress: true
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'app/app.bundle.min.js': [jsFileList, '<%= src.js %>' ,'<%= src.jsTpl %>']
        }
      }
    },
    watch:{
      all: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      }
    },
  });

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  /**
   * Register tasks
   */
  grunt.registerTask('default', [
    'dev',
    'watch:all'
  ]);
  grunt.registerTask('dev', [
    'jshint',
    'concat:js',
    'less:dev',
    'concat:css',
  ]);
  grunt.registerTask('build', [
    'jshint',
    'less:build',
    'concat:css_build',
    'uglify',
  ]);
};