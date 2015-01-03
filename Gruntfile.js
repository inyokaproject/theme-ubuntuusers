/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
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
  grunt.registerTask('default', ['jshint', 'less', 'concat', 'uglify']);

};
