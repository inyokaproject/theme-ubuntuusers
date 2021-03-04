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
    compress: {
      main: {
        options: {
          mode: 'gzip',
          level: 9, // best compression, see http://zlib.net/manual.html#Constants
        },
        files: [
          {expand: true, src: ['inyoka_theme_ubuntuusers/static/font/**/*.ttf'], ext: '.ttf.gz', extDot: 'last'},
          {expand: true, src: ['inyoka_theme_ubuntuusers/static/js/**/*.js'], ext: '.js.gz', extDot: 'last'},
          {expand: true, src: ['inyoka_theme_ubuntuusers/static/**/*.css', '!inyoka_theme_ubuntuusers/static/font/**'], ext: '.css.gz', extDot: 'last'},
          {expand: true, src: ['inyoka_theme_ubuntuusers/static/**/*.ico'], ext: '.ico.gz', extDot: 'last'},
          {expand: true, src: ['inyoka_theme_ubuntuusers/static/**/*.svg'], ext: '.svg.gz', extDot: 'last'},
        ]
      }
    },


    postcss: {
      options: {
        processors: [
          require('autoprefixer')({remove: false}), // add vendor prefixes (not remove deprecated ones)
        ]
      },
      dist: {
        src: ['inyoka_theme_ubuntuusers/static/**/*.css', '!inyoka_theme_ubuntuusers/static/font/**']
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
        options: {
          undef: false,
        },
        src: 'Gruntfile.js'
      }
    },


    watch: {
      options: {
        atBegin: true
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      sprite: {
        files: ['<%= sprite.editor.src %>', '<%= sprite.forum.src %>', '<%= sprite.main.src %>'],
        tasks: ['sprite'],
      },
      style: {
        files: [
          'inyoka_theme_ubuntuusers/static/style/*.less',
          '!inyoka_theme_ubuntuusers/static/style/*-sprite.less',
        ],
        tasks: ['less', 'postcss:dist'],
      },
    },


    sprite: {
      forum: {
        src: 'inyoka_theme_ubuntuusers/static/img/forum/*.png',
        dest: 'inyoka_theme_ubuntuusers/static/img/forum-sprite.png',
        destCss: 'inyoka_theme_ubuntuusers/static/style/forum-sprite.less',
        imgPath: '../img/forum-sprite.png',
        algorithm: 'top-down',
        padding: 8
      },
    },


    less: {
      production: {
        options: {
          banner: '/*!\n<%= banner %>',
          compress: true,
          javascriptEnabled: true
        },
        files: [
          {
            expand: true,
            src: [
              'inyoka_theme_ubuntuusers/static/style/**/*.less',
              '!inyoka_theme_ubuntuusers/static/style/*-sprite.less',
            ],
            ext: '.css',
          }
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-spritesmith');

  // Default task.
  grunt.registerTask('default', ['jshint', 'sprite', 'less', 'postcss:dist', 'compress']);

};
