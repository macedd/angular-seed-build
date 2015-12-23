module.exports = function(config){
  var appJsFiles = require('./build-js.json');

  appJsFiles.push.apply(appJsFiles, [
      "bower_components/angular-mocks/angular-mocks.js",
      'app/app.js',
      'app/*/**/*.js'
    ]);

  config.set({

    basePath : './',

    files : appJsFiles,

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
