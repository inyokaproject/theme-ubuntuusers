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
          {expand: true, src: ['inyoka_theme_ubuntuusers/static/js/**/*.min.js'], ext: '.js.gz', extDot: 'last'},
          {expand: true, src: ['inyoka_theme_ubuntuusers/static/**/*.css', '!inyoka_theme_ubuntuusers/static/font/**'], ext: '.css.gz', extDot: 'last'},
          {expand: true, src: ['inyoka_theme_ubuntuusers/static/**/*.ico'], ext: '.ico.gz', extDot: 'last'},
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

    uglify: {
      options: {
        banner: '/**\n<%= banner %>',
        compress: {},
      },
      dist: {
        expand: true,
        cwd: 'inyoka_theme_ubuntuusers/static/js/',
        src: [
          '*.js',
          '!*.min.js',
          '!less.js',
          '!jquery{.ba-hashchange,.cookie}.js',
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
          '!inyoka_theme_ubuntuusers/static/style/*.m.less'
        ],
        tasks: ['less', 'postcss:dist'],
      },
    },


    sprite: {
      editor: {
        src: [
          'inyoka_theme_ubuntuusers/static/img/icons/bold.png',
          'inyoka_theme_ubuntuusers/static/img/icons/italic.png',
          'inyoka_theme_ubuntuusers/static/img/icons/underlined.png',
          'inyoka_theme_ubuntuusers/static/img/icons/bulletlist.png',
          'inyoka_theme_ubuntuusers/static/img/icons/numlist.png',
          'inyoka_theme_ubuntuusers/static/img/icons/code.png',
          'inyoka_theme_ubuntuusers/static/img/icons/stroke.png',
          'inyoka_theme_ubuntuusers/static/img/icons/monospace.png',
          'inyoka_theme_ubuntuusers/static/img/icons/mark.png',
          'inyoka_theme_ubuntuusers/static/img/icons/wikilink.png',
          'inyoka_theme_ubuntuusers/static/img/icons/link.png',
          'inyoka_theme_ubuntuusers/static/img/icons/user.png',
          'inyoka_theme_ubuntuusers/static/img/icons/quote.png',
          'inyoka_theme_ubuntuusers/static/img/icons/pre.png',
          'inyoka_theme_ubuntuusers/static/img/icons/picture.png',
          'inyoka_theme_ubuntuusers/static/img/icons/color.png',
          'inyoka_theme_ubuntuusers/static/img/icons/smiley.png',
          'inyoka_theme_ubuntuusers/static/img/icons/date.png',
          'inyoka_theme_ubuntuusers/static/img/icons/sig.png',
          'inyoka_theme_ubuntuusers/static/img/icons/shrink.png',
          'inyoka_theme_ubuntuusers/static/img/icons/enlarge.png',
        ],
        dest: 'inyoka_theme_ubuntuusers/static/img/editor-sprite.png',
        destCss: 'inyoka_theme_ubuntuusers/static/style/editor-sprite.less',
        imgPath: '../img/editor-sprite.png',
        algorithm: 'top-down',
        padding: 2
      },
      forum: {
        src: 'inyoka_theme_ubuntuusers/static/img/forum/*.png',
        dest: 'inyoka_theme_ubuntuusers/static/img/forum-sprite.png',
        destCss: 'inyoka_theme_ubuntuusers/static/style/forum-sprite.less',
        imgPath: '../img/forum-sprite.png',
        algorithm: 'top-down',
        padding: 8
      },
      main: {
        src: [
          'inyoka_theme_ubuntuusers/static/img/tabbar_left.png',
          'inyoka_theme_ubuntuusers/static/img/tabbar_center.png',
          'inyoka_theme_ubuntuusers/static/img/tabbar_right.png',
          'inyoka_theme_ubuntuusers/static/img/tabbar_left_hover.png',
          'inyoka_theme_ubuntuusers/static/img/tabbar_center_hover.png',
          'inyoka_theme_ubuntuusers/static/img/tabbar_right_hover.png',
          'inyoka_theme_ubuntuusers/static/img/icons/portal.png',
          'inyoka_theme_ubuntuusers/static/img/icons/forum.png',
          'inyoka_theme_ubuntuusers/static/img/icons/wiki.png',
          'inyoka_theme_ubuntuusers/static/img/icons/ikhaya.png',
          'inyoka_theme_ubuntuusers/static/img/icons/planet.png',
          'inyoka_theme_ubuntuusers/static/img/icons/community.png'
        ],
        dest: 'inyoka_theme_ubuntuusers/static/img/main-sprite.png',
        destCss: 'inyoka_theme_ubuntuusers/static/style/main-sprite.less',
        imgPath: '../img/main-sprite.png',
        algorithm: 'top-down'
      },
      icon: {
        src: 'inyoka_theme_ubuntuusers/static/img/smiley_icons/*.png',
        dest: 'inyoka_theme_ubuntuusers/static/img/icon-sprite.png',
        destCss: 'inyoka_theme_ubuntuusers/static/style/icon-sprite.less',
        imgPath: '../img/icon-sprite.png',
        algorithm: 'top-down',
        padding: 2
      }
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
              '!inyoka_theme_ubuntuusers/static/style/*.m.less'
            ],
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
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-spritesmith');

  // Default task.
  grunt.registerTask('default', ['jshint', 'sprite', 'less', 'postcss:dist', 'uglify', 'compress']);

};
