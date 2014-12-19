var gulp = require('gulp')
  , plugins = require('gulp-load-plugins')()
  , rimraf = require('rimraf')
  , express = require('express')
  , patches = require('./patches')
  , config = require('config')

gulp.task('clean', function (done) {
  rimraf('./dist', done)
})

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('sass', function () {
  return gulp.src('app/css/scss/**.scss')
    .pipe(plugins.rubySass({ style: 'expanded' }))
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('app/css/compiled'))
})

gulp.task('config', function () {
  return gulp.src('app/scripts/config.tpl.js')
    .pipe(plugins.template({ data: JSON.stringify(config, null, '  ').split('\n').join('\n  ') }))
    .pipe(plugins.rename('config.js'))
    .pipe(gulp.dest('app/scripts'))
})

gulp.task('html', function () {
  return gulp.src('app/index.html')
    .pipe(plugins.useref.assets())
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.minifyCss( { keepSpecialComments: 0, keepBreaks: true })))
    .pipe(plugins.useref.restore())
    .pipe(plugins.useref())
    .pipe(gulp.dest('dist'))
})

gulp.task('copy', function () {
  return gulp.src('app/views/**')
    .pipe(gulp.dest('dist/views'))
})

gulp.task('patch', function () {
  return gulp.src('patches/**')
    .pipe(plugins.rename(function (path) {
      if (!path.basename || 'index' === path.basename) return
      path.dirname = patches[path.basename + path.extname]
    }))
    .pipe(gulp.dest('.'))
})

gulp.task('watch', function () {
  // gulp.start('default')

  // gulp.watch('config/**', ['config'])
  // gulp.watch('app/scripts/providers/config.tpl.js', ['config'])
  // gulp.watch('app/css/scss/**/*.scss', ['sass'])
  // gulp.watch('app/images/**/*', ['images'])

  var livereload = plugins.livereload()

  gulp.watch([
    'app/**/*',
    '!app/**/*.map',
    '!app/bower/**',
    '!app/css/lib/**',
    '!app/**/*.scss'
  ]).on('change', function (file) {
    livereload.changed(file.path)
  })

  express()
    .use(express.static(__dirname + '/app'))
    .listen(process.env.PORT || 3000)
})

gulp.task('default', ['clean', 'sass', 'config'], function() {
    // gulp.start('html', 'images', 'copy')
})