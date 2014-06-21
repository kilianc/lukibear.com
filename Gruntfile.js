var matchdep = require('matchdep')

module.exports = function (grunt) {
  matchdep
    .filterDev('grunt-*')
    .forEach(grunt.loadNpmTasks)

  var config = Object.create(null)

  config.clean = {
    dist: ['dist/*']
  }

  config.sass = {
    options: {
      sourcemap: true
    },
    files: {
      expand: true,
      cwd: 'app/css/scss',
      src: ['**/*.scss'],
      dest: 'app/css/compiled/',
      ext: '.css',
      filter: function (src) {
        var file = grunt.option('watchFilter')
        return undefined === file || file === src
      }
    }
  }

  config.copy = {
    dist: {
      expand: true,
      dot: true,
      cwd: 'app/',
      dest: 'dist/',
      src: [
        'bower/**',
        'images/**',
        'views/**',
        'index.html'
      ]
    },
    patch: {
      files: {
        'node_modules/grunt-contrib-watch/tasks/lib/taskrun.js': 'patches/taskrun.js'
      }
    }
  }

  config.ngmin = {
    'dist/scripts/app.min.js': 'dist/scripts/app.min.js',
    'dist/scripts/angular.min.js': 'dist/scripts/angular.min.js'
  }

  config.useminPrepare = {
    html: ['app/index.html'],
    options: {
      dest: 'dist/'
    }
  }

  config.usemin = {
    options: {
      dirs: ['dist/']
    },
    html: ['dist/index.html']
  }

  config.htmlmin = {
    dist: {
      options: {
        collapseWhitespace: true,
        removeComments: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: false
      },
      expand: true,
      cwd: 'dist/',
      src: [
        '*.html',
        'views/**/*.html'
      ],
      dest: 'dist/'
    }
  }

  config.concat = {
    options: {
      stripBanners: {
        block: true,
        line: true
      },
      process: false
    }
  }

  config.connect = {
    app: {
      options: {
        hostname: '*',
        port: 3000,
        base: 'app/'
      }
    },
    dist: {
      options: {
        port: 3030,
        base: 'dist/'
      }
    }
  }

  grunt.initConfig(config)

  grunt.registerTask('compile:config', function () {
    if (!process.env.NODE_ENV) {
      console.error('NODE_ENV="%s" is falsy, exiting.', process.env.NODE_ENV)
      process.exit(1)
    }

    var config = require('config')
    var configSources = config.getConfigSources().forEach(function (item) {
      console.log('Loading ' + item.name)
    })

    var configServiceTpl = grunt.file.read('app/scripts/providers/config.ejs')
    var configService = grunt.template.process(configServiceTpl, {
      data: {
        config: JSON.stringify(config, null, '  ').split('\n').join('\n    ')
      }
    })

    grunt.file.write('app/scripts/providers/config.js', configService)
  })

  grunt.event.on('watch', function (status, filepath, target) {
    grunt.file.write('./.watch', filepath)
  })

  grunt.registerTask('watchFilter', function () {
    if (grunt.file.exists('./.watch')) {
      grunt.option('watchFilter', grunt.file.read('./.watch'))
      grunt.file.delete('./.watch')
    }
  })

  grunt.registerTask('watch:sass+app', function () {
    grunt.config('watch', {
      sass: {
        files: 'app/css/**/*.scss',
        tasks: ['watchFilter', 'sass']
      },
      app: {
        files: [
          'app/**/*',
          '!app/**/*.map',
          '!app/bower/**',
          '!app/css/lib/**',
          '!app/**/*.scss'
        ],
        options: {
          livereload: true
        }
      }
    })

    grunt.task.run('watch')
  })

  grunt.registerTask('watch:dist', function () {
    grunt.config('watch', {
      dist: {
        files: [
          'app/**/*',
          '!app/**/*.map',
          '!app/bower/**',
          '!app/css/lib/**',
          '!app/**/*.scss'
        ],
        tasks: ['build'],
      },
      options: {
        livereload: true
      }
    })

    grunt.task.run('watch')
  })

  grunt.registerTask('build', [
    'clean:dist',
    'sass',
    'copy:patch',
    'copy:dist',
    'useminPrepare',
    'usemin:html',
    'concat',
    'cssmin',
    'htmlmin:dist',
    'ngmin',
    'uglify'
  ])

  grunt.registerTask('server:app', [
    'copy:patch',
    'sass',
    'connect:app',
    'watch:sass+app'
  ])

  grunt.registerTask('server:dist', [
    'build',
    'connect:dist',
    'watch:dist'
  ])

  grunt.registerTask('default', [
    'server:app'
  ])
}