/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: ' * <%= pkg.title %>\n' +
            ' * <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' * :copyright: (c) 2007-<%= grunt.template.today("yyyy") %> by the <%= pkg.author %>\n' +
            ' * :license: <%= pkg.license %>\n' +
            ' */\n',
    // Task configuration.
    uglify: {
      options: {
        banner: '/**\n<%= banner %>',
        compress: true,
      },
      dist: {
        expand: true,
        cwd: 'inyoka_theme_ubuntuusers/static/js/',
        src: [
          '*.js',
          '!*.min.js',
          '!less.js',
          '!jquery{,.ba-hashchange,.cookie}.js',
        ],
        dest: 'inyoka_theme_ubuntuusers/static/js/',
        ext: '.min.js',
        extDot: 'last',
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      }
    },
    less: {
      production: {
        options: {
          banner: '/*!\n<%= banner %>',
          compress: true
        },
        files: [
          {
            expand: true,
            cwd: 'inyoka_theme_ubuntuusers/static/style/',
            src: ['*.less', '!*.m.less'],
            dest: 'inyoka_theme_ubuntuusers/static/style/',
            ext: '.css',
          },
          {
            "inyoka_theme_ubuntuusers/static/style/overall.m.css": "inyoka_theme_ubuntuusers/static/style/overall.m.less",
            "inyoka_theme_ubuntuusers/static/forum/style/overall.m.css": "inyoka_theme_ubuntuusers/static/forum/style/overall.m.less",
            "inyoka_theme_ubuntuusers/static/ikhaya/style/overall.m.css": "inyoka_theme_ubuntuusers/static/ikhaya/style/overall.m.less",
            "inyoka_theme_ubuntuusers/static/planet/style/overall.m.css": "inyoka_theme_ubuntuusers/static/planet/style/overall.m.less",
            "inyoka_theme_ubuntuusers/static/portal/style/overall.m.css": "inyoka_theme_ubuntuusers/static/portal/style/overall.m.less",
            "inyoka_theme_ubuntuusers/static/wiki/style/overall.m.css": "inyoka_theme_ubuntuusers/static/wiki/style/overall.m.less"
          }
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task.
  grunt.registerTask('default', ['jshint', 'less', 'uglify']);

};
