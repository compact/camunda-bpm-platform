/* jshint node: true */
'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var pkg = require('./package.json');

  var config = pkg.gruntConfig || {};

  config.grunt = grunt;
  config.pkg = pkg;

  grunt.initConfig({
    // the default value should be the "dev" destination
    // this is not exactly the best solution, but otherwise, when tasks are "rerunned"
    // with the watch tasks, the value get lost...
    // so, it's fine for the "dist" build mode
    // who will override the value but only run once
    buildTarget:      config.devTarget,

    pkg:              pkg,

    bower:            require('camunda-commons-ui/grunt/config/bower')(config),

    jasmine_node:     require('camunda-commons-ui/grunt/config/jasmine_node')(config),

    karma:            require('camunda-commons-ui/grunt/config/karma')(config),

    protractor:       require('camunda-commons-ui/grunt/config/protractor')(config),

    seleniuminstall:  require('camunda-commons-ui/grunt/config/seleniuminstall')(config),

    requirejs:        require('./grunt/config/requirejs')(config),

    less:             require('camunda-commons-ui/grunt/config/less')(config),

    copy:             require('camunda-commons-ui/grunt/config/copy')(config),

    watch:            require('./grunt/config/watch')(config),

    connect:          require('camunda-commons-ui/grunt/config/connect')(config),

    jsdoc:            require('camunda-commons-ui/grunt/config/jsdoc')(config),

    jshint:           require('camunda-commons-ui/grunt/config/jshint')(config),

    changelog:        require('camunda-commons-ui/grunt/config/changelog')(config),

    clean:            ['doc', 'dist', '.tmp']
  });


  grunt.registerTask('build', function(mode) {
    mode = mode || 'prod';

    grunt.config.data.buildTarget = (mode === 'prod' ? config.prodTarget : config.devTarget);
    grunt.log.writeln('Will build the project in "'+ mode +'" mode and place it in "'+ grunt.config('buildTarget') +'"');

    var tasks = [
      'clean',
      'jshint',
      'jsdoc',
      'bower',
      'copy',
      'less',
      'requirejs'
    ];

    grunt.task.run(tasks);
  });


  grunt.registerTask('auto-build', [
    'build:dev',
    'connect',
    'watch'
  ]);


  grunt.registerTask('postinstall', ['seleniuminstall']);

  grunt.registerTask('prepublish', ['build', 'changelog']);

  grunt.registerTask('default', ['build']);
};
