'use strict';

var gulp = require('gulp');

var fs = require('fs');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var traceur = require('gulp-traceur');
var header = require('gulp-header');
var merge = require('merge-stream');
var mocha = require('gulp-mocha');

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

gulp.task('build', ['lint', 'clean'], function() {
    var src = gulp.src('src/**/*.js')
        .pipe(traceur())
        .pipe(gulp.dest('out/src'));
    var test = gulp.src('test/*/**/*.js')
        .pipe(traceur())
        .pipe(header(fs.readFileSync('test/Runner.js', 'utf8')))
        .pipe(gulp.dest('out/test'));
    return merge(src, test);
});

gulp.task('test', ['build'], function () {
    return gulp.src('out/test/**/*.js')
        .pipe(mocha({
            reporter: 'nyan'
        }));
});
