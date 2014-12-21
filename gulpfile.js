'use strict';

var gulp = require('gulp');

var fs = require('fs');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var browserify = require('browserify');
var es6ify = require('es6ify');
var source = require('vinyl-source-stream');
var traceur = require('gulp-traceur');
var header = require('gulp-header');
var filter = require('gulp-filter');
var merge = require('merge-stream');
var mocha = require('gulp-mocha');

var pack = require('./package.json');

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
    return browserify({
            entries: [es6ify.runtime, './src/index.js'],
            debug: true
        })
        .transform(es6ify)
        .bundle()
        .pipe(source(pack.name + '.js'))
        .pipe(gulp.dest('./out/build'));
});

gulp.task('test', function() {
    var src = gulp.src('src/**/*.js')
        .pipe(traceur())
        .pipe(gulp.dest('out/src'));
    var test = gulp.src('test/*/**/*.js')
        .pipe(traceur())
        .pipe(header(fs.readFileSync('test/Runner.js', 'utf8')))
        .pipe(gulp.dest('out/test'));
    return merge(src, test)
        .pipe(filter(function(file) {
            return /test/.test(file.path);
        }))
        .pipe(mocha({
            reporter: 'nyan'
        }));
});
