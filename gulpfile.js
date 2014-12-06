'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var traceur = require('gulp-traceur');

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

gulp.task('clean', function () {
    return gulp.src('out', { read: false })
        .pipe(clean());
});

gulp.task('lint', function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('build', ['lint'], function() {
    return gulp.src('src/**/*.js')
        .pipe(traceur())
        .pipe(gulp.dest('out'));
});
