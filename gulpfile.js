/*!
 * gulpfile.js
 * Created by Kilian Ciuffolo on Feb 15, 2016
 * (c) 2016 lukibear https://lukibear.com
 */

'use strict'

const join = require('path').join
const gulp = require('gulp')
const run = require('run-sequence')
const plugins = require('gulp-load-plugins')()
const del = require('del')
const neat = require('node-neat').includePaths
const pngquant = require('imagemin-pngquant')
const browserify = require('browserify')
const watchify = require('watchify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const express = require('express')
const semver = require('semver')
const NODE_VERSION = require('./package.json').engines.node

// enforce node version for consistency
if (semver.lt(process.version, NODE_VERSION)) {
  console.error('\n \x1b[31m Error: You are running node %s, please switch to %s\n', process.version, NODE_VERSION)
  process.exit(1)
}

plugins.util.log('Using NODE_ENV="%s"', process.env.NODE_ENV)

gulp.task('clean:dist', (done) => {
  return del('dist')
})

gulp.task('clean:release', (done) => {
  return del('release')
})

gulp.task('clean:css', () => {
  return del('app/bundle.min.css*')
})

gulp.task('clean:js', () => {
  return del('app/bundle.min.js*')
})

gulp.task('clean:app', (done) => {
  run(['clean:css', 'clean:js'], done)
})

gulp.task('clean', (done) => {
  run(['clean:dist', 'clean:app', 'clean:release'], done)
})

gulp.task('clean:npm', (done) => {
  del('node_modules', done)
})

gulp.task('css', () => {
  return gulp.src('app/css/main.scss')
    .pipe(plugins.rename('bundle.min.css'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      includePaths: ['styles'].concat(neat)
    }))
      .on('error', plugins.sass.logError)
    .pipe(plugins.postcss([
      require('postcss-assets')({
        loadPaths: ['images'],
        basePath: 'app',
        relative: true
      })
    ]))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('app'))
})

gulp.task('js', () => {
  if (!browserify.bundler) {
    browserify.bundler = browserify({
      cache: {},
      debug: true,
      entries: 'app/scripts/main.js',
      packageCache: {}
    })
    .plugin(watchify, {
      ignoreWatch: '**'
    })
    .transform('babelify')
    .transform('browserify-versionify')
    .transform('envify')
  }

  return browserify.bundler
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({ loadMaps: true }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('app'))
})

gulp.task('revisions', function () {
  var ignore = ['.html', /fonts/, /og-image/]
  var revAll = new plugins.revAll({ // eslint-disable-line
    dontRenameFile: ignore,
    dontUpdateReference: ignore
  })

  return gulp.src('dist/**')
    .pipe(revAll.revision())
    .pipe(gulp.dest('release'))
})

gulp.task('copy:fonts', () => {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('copy:videos', () => {
  return gulp.src('app/videos/**/*')
    .pipe(gulp.dest('dist/videos'))
})

gulp.task('copy:maps', () => {
  return gulp.src('app/**/*.map')
    .pipe(gulp.dest('release'))
})

gulp.task('minify:images', function () {
  return gulp.src('app/images/**/*')
    .pipe(plugins.imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('minify:js', () => {
  return gulp.src('app/bundle.min.js')
    .pipe(plugins.sourcemaps.init({ loadMaps: true }))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
})

gulp.task('minify:css', () => {
  return gulp.src('app/bundle.min.css')
    .pipe(plugins.cssnano({
      discardComments: { removeAll: true }
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('minify:html', () => {
  return gulp.src('app/index.html')
    .pipe(plugins.htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
})

gulp.task('minify', (done) => {
  run(['minify:js', 'minify:images', 'minify:css', 'minify:html'], done)
})

gulp.task('serve', ['build:app'], (done) => {
  gulp.watch('app/css/*', ['css'])
  gulp.watch('app/scripts/*', ['js'])

  plugins.livereload({ start: true })

  gulp.watch([
    'app/**/*',
    '!app/**/*.map',
    '!app/css/*',
    '!app/scripts/*'
  ]).on('change', (file) => {
    plugins.livereload.changed(file.path)
  })

  let BASE = process.env.BASE || '/app'
  let PORT = process.env.PORT || 3000
  let server = express()

  server.use(require('connect-livereload')())
  server.use(BASE, express.static(join(__dirname, BASE), { etag: false }))

  server.listen(PORT, () => {
    plugins.util.log(`Express server listening at http://localhost:${PORT}${BASE}`)
    done()
  })
})

gulp.task('build:app', (done) => {
  run('clean:app', ['css', 'js'], done)
})

gulp.task('build:dist', (done) => {
  run(
    [
      'build:app',
      'clean:dist'
    ],
    [
      'copy:fonts',
      'copy:videos',
      'minify'
    ],
    done
  )
})

gulp.task('build:release', (done) => {
  run(
    [
      'build:dist',
      'clean:release'
    ],
    [
      'copy:maps',
      'revisions'
    ],
    done
  )
})

gulp.task('default', ['build:release'])
