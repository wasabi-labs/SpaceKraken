'use strict';

var gulp = require('gulp');
var traceur = require('gulp-traceur');
var clean = require('gulp-clean');

gulp.task('default', ['clean'], function() {
	gulp.start('build');
});

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(traceur())
    .pipe(gulp.dest('out'));
});

gulp.task('clean', function () {
  return gulp.src('out', { read: false })
    .pipe(clean());
});