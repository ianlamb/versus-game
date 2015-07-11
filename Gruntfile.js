module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'Gruntfile.js',
        'package.json',
        'bower.json',
        'server.js',
        'public/js/**/*.js',
        'game/**/*.js'
      ],
      options: {
        undef: true,
        curly: true,
        latedef: true,
        browser: true,
        devel: true,
        globals: {
          $: true,
          jQuery: true,
          module: true,
          ga: true,
          require: true,
          process: true,
          __dirname: true,
          exports: true,
          res: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

};