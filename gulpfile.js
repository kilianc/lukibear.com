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
    .on('error', function (err) { console.log(err) })
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('app/css/compiled'))
})

gulp.task('config', function () {
  // hack: reload config
  delete require.cache[require.resolve('config')]
  config = require('config')

  var data = JSON.stringify(config, null, '  ').split('\n').join('\n')

  return gulp.src('app/scripts/config.js.tpl')
    .pipe(plugins.template({ data: data }))
    .pipe(plugins.rename('config.js'))
    .pipe(gulp.dest('app/scripts'))
})

gulp.task('html', function () {
  var assets = plugins.useref.assets()

  return gulp.src('app/index.html')
    .pipe(assets)
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.minifyCss( { keepSpecialComments: 0, keepBreaks: true })))
    .pipe(assets.restore())
    .pipe(plugins.useref())
    .pipe(gulp.dest('dist'))
})

gulp.task('copy', function () {
  gulp.src('app/views/**')
    .pipe(gulp.dest('dist/views'))

  gulp.src('app/bower/**')
    .pipe(gulp.dest('dist/bower'))
})

gulp.task('patch', function () {
  return gulp.src(['patches/**', '!patches/index.json'])
    .pipe(plugins.rename(function (path) {
      if (!path.basename || 'index' === path.basename) return
      path.dirname = patches[path.basename + path.extname]
    }))
    .pipe(gulp.dest('.'))
})

gulp.task('watch', function () {
  gulp.start('default')

  gulp.watch('config/**', ['config'])
  gulp.watch('app/scripts/config.js.tpl', ['config'])
  gulp.watch('app/css/scss/**/*.scss', ['sass'])
  gulp.watch('app/images/**/*', ['images'])

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
    .use(express.static(__dirname + (process.env.DIR || '/app'), { etag: false }))
    .listen(process.env.PORT || 3000)
})

gulp.task('default', ['clean', 'sass', 'config'], function() {
    gulp.start('html', 'images', 'copy')
})