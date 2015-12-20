'use strict';

var gulp = require('gulp');

var sass = require('gulp-sass');

var webpack = require('gulp-webpack');

gulp.task('scss', function() {
  gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
  ;
});

gulp.task('webpack', function() {
  return gulp.src('src/js/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/js'))
  ;
});

gulp.task('scss:watch', function () {
  gulp.watch('./src/scss/**/*.scss', ['scss']);
});

gulp.task('webpack:watch', function () {
  gulp.watch('./src/js/index.js', ['webpack']);
});

gulp.task('watch', ['scss:watch', 'webpack:watch']);

gulp.task('default', ['scss', 'webpack', 'watch']);
